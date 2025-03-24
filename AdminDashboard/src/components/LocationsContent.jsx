import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin, Phone, Clock, ListFilter, Map as MapIcon, Check, X, Bell } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../hooks/supabaseClient';

// Set your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LocationsContent = () => {
  // Helper function to convert between numeric status codes and display text
  const getStatusText = (statusCode) => {
    switch(statusCode) {
      case 1: return 'Solicitado';
      case 2: return 'Activo';
      case 3: return 'Inactivo';
      default: return 'Desconocido';
    }
  };
  
  const getStatusCode = (statusText) => {
    switch(statusText) {
      case 'Solicitado': return 1;
      case 'Activo': return 2;
      case 'Inactivo': return 3;
      case 'Todos': return 'Todos';
      default: return null;
    }
  };

  // Existing states 
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('Todas las zonas');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    id: null,
    name: '',
    address: '',
    area: '',
    phone: '',
    email: '',
    schedule: '',
    status: 2, // Default to "Active" (2) instead of "Activo"
    description: '',
    image: null
  });
  
  // New state for petitions
  const [petitions, setPetitions] = useState([]);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [showPetitionsSection, setShowPetitionsSection] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState(null);
  
  // Map refs and state
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('Location')
        .select(`
          id, 
          name, 
          description, 
          image_url,
          point,
          location_type,
          sustainability_score,
          status,
          address,
          email,
          phone_number,
          opening_hours,
          LocationType(name)
        `)
        .not('status', 'eq', 1); // Exclude requested locations
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      // Transform data to match component structure
      const formattedLocations = data.map(loc => ({
        id: loc.id,
        name: loc.name,
        address: loc.address || '',
        area: loc.LocationType?.name || 'Sin categoría', // Using LocationType as "area"
        phone: loc.phone_number || '',
        email: loc.email || '',
        schedule: loc.opening_hours || '',
        status: loc.status, // Keep as numeric code
        statusText: getStatusText(loc.status), // Add display text
        description: loc.description || '',
        image: loc.image_url || null,
        visits: loc.sustainability_score || 0, // Using sustainability_score as "visits" 
        // Extract coordinates from PostGIS point type
        longitude: loc.geography ? JSON.parse(loc.geography).coordinates[0] : -3.70379,
        latitude: loc.geography ? JSON.parse(loc.geography).coordinates[1] : 40.41678
      }));
      
      setLocations(formattedLocations);
      setFilteredLocations(formattedLocations);
    };
    
    fetchLocations();
  }, []);

  // Fetch pending location requests
  useEffect(() => {
    const fetchPetitions = async () => {
      const { data, error } = await supabase
        .from('Location')
        .select('*')
        .eq('status', 1) // Status 1 means "requested"
        .not('solicited_at', 'is', null);
      
      if (error) {
        console.error('Error fetching location petitions:', error);
        return;
      }
      
      // Transform petition data
      const formattedPetitions = data.map(loc => ({
        id: loc.id,
        name: loc.name,
        address: loc.address || '',
        area: loc.area || 'Centro',
        phone: loc.phone_number || '',
        email: loc.email || '',
        schedule: loc.opening_hours || '',
        description: loc.description || '',
        location_type: loc.location_type,
        status: loc.status,
        longitude: loc.geography ? JSON.parse(loc.geography).coordinates[0] : -3.70379,
        latitude: loc.geography ? JSON.parse(loc.geography).coordinates[1] : 40.41678,
        requestDate: loc.solicited_at ? new Date(loc.solicited_at).toLocaleDateString() : 'Desconocido'
      }));
      
      setPetitions(formattedPetitions);
      setFilteredPetitions(formattedPetitions);
    };
    
    fetchPetitions();
  }, []);

  // Initialize map when the component mounts and viewMode changes to 'map'
  useEffect(() => {
    if (viewMode === 'map') {
      // Create new map instance or reinitialize if needed
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-3.70379, 40.41678], // Madrid, Spain
          zoom: 12
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl());
        
        // Add markers when map loads
        map.current.on('load', () => {
          addMarkersToMap();
        });
      } else {
        // If map instance exists but container has changed, need to force resize
        map.current.resize();
        
        // Ensure markers are refreshed
        if (map.current.loaded()) {
          addMarkersToMap();
        }
      }
    }
    
    return () => {
      // Clean up markers and map when view changes or component unmounts
      if (viewMode !== 'map' && map.current) {
        Object.values(markers.current).forEach(marker => marker.remove());
        markers.current = {};
        map.current.remove();
        map.current = null;
      }
    };
  }, [viewMode]);

  // Update markers when filtered locations change
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      addMarkersToMap();
    }
  }, [filteredLocations]);

  // Function to add markers to map
  const addMarkersToMap = () => {
    // Remove existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Add new markers for filtered locations
    filteredLocations.forEach(location => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = location.status === 2 ? '#3b82f6' : '#6b7280';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      
      // Add pin icon inside marker
      const icon = document.createElement('div');
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      el.appendChild(icon);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold;">${location.name}</h3>
            <p style="font-size: 14px;">${location.address}</p>
            <p style="font-size: 14px;">${location.phone}</p>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button class="edit-btn" data-id="${location.id}" style="color: #2563eb;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
              </button>
              <button class="delete-btn" data-id="${location.id}" style="color: #dc2626;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
              </button>
            </div>
          </div>
        `);
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current);
        
      markers.current[location.id] = marker;
      
      // Event listeners for popup buttons
      setTimeout(() => {
        const editBtn = document.querySelector(`.edit-btn[data-id="${location.id}"]`);
        const deleteBtn = document.querySelector(`.delete-btn[data-id="${location.id}"]`);
        
        if (editBtn) editBtn.addEventListener('click', () => handleEdit(location));
        if (deleteBtn) deleteBtn.addEventListener('click', () => handleDelete(location.id));
      }, 100);
    });
  };

  // Rest of your existing code (filter, add, edit, delete handlers)
  
  // Replace text status with objects that contain both code and text
  const statuses = [
    { code: 'Todos', text: 'Todos' },
    { code: 2, text: 'Activo' },
    { code: 3, text: 'Inactivo' }
  ];

  // Existing filter effect
  useEffect(() => {
    let filtered = locations;
    
    if (searchTerm) {
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterArea !== 'Todas las zonas') {
      filtered = filtered.filter(location => location.area === filterArea);
    }
    
    if (filterStatus !== 'Todos') {
      // Convert filterStatus to code if needed
      const statusCode = typeof filterStatus === 'number' ? filterStatus : getStatusCode(filterStatus);
      filtered = filtered.filter(location => location.status === statusCode);
    }
    
    setFilteredLocations(filtered);
  }, [searchTerm, filterArea, filterStatus, locations]);

  // Handler functions
  const handleAddNew = () => {
    setCurrentLocation({
      id: null,
      name: '',
      address: '',
      area: 'Centro',
      phone: '',
      email: '',
      schedule: '',
      status: 2, // Active status (2)
      description: '',
      image: null,
      longitude: -3.70379,
      latitude: 40.41678,
      visits: 0
    });
    setShowModal(true);
  };

  const handleEdit = (location) => {
    setCurrentLocation({...location});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este local?')) {
      const { error } = await supabase
        .from('Location')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting location:', error);
        return;
      }
      
      setLocations(locations.filter(location => location.id !== id));
    }
  };

  const handleSave = async () => {
    // Prepare location data for Supabase
    const locationData = {
      name: currentLocation.name,
      address: currentLocation.address,
      description: currentLocation.description,
      email: currentLocation.email,
      phone_number: currentLocation.phone,
      opening_hours: currentLocation.schedule,
      status: currentLocation.status,
      // Create PostGIS point from longitude/latitude
      point: `POINT(${currentLocation.longitude} ${currentLocation.latitude})`,
      // Assuming sustainability_score represents visits in this UI
      sustainability_score: currentLocation.visits || 0
    };

    if (currentLocation.id) {
      // Update existing location
      const { error } = await supabase
        .from('Location')
        .update(locationData)
        .eq('id', currentLocation.id);
      
      if (error) {
        console.error('Error updating location:', error);
        return;
      }
      
      // Update local state
      setLocations(locations.map(loc => 
        loc.id === currentLocation.id ? {...loc, ...currentLocation} : loc
      ));
    } else {
      // Add new location
      const { data, error } = await supabase
        .from('Location')
        .insert(locationData)
        .select();
      
      if (error) {
        console.error('Error adding location:', error);
        return;
      }
      
      // Update with the returned data (to get the new ID)
      const newLocation = {
        ...currentLocation,
        id: data[0].id
      };
      
      setLocations([...locations, newLocation]);
    }
    
    setShowModal(false);
  };

  // New handlers for petitions
  const handleAcceptPetition = async (petition) => {
    // Update the location status to Active (2)
    const { error } = await supabase
      .from('Location')
      .update({ 
        status: 2, // Active status (2)
        solicited_at: null // Clear the solicited flag
      })
      .eq('id', petition.id);
    
    if (error) {
      console.error('Error accepting location petition:', error);
      return;
    }
    
    // Add to active locations
    const newLocation = {
      ...petition,
      status: 2, // Active status (2)
      statusText: 'Activo',
      visits: 0
    };
    
    setLocations([...locations, newLocation]);
    
    // Remove from petitions
    setPetitions(petitions.filter(p => p.id !== petition.id));
    
    // Close petition details if open
    if (selectedPetition && selectedPetition.id === petition.id) {
      setSelectedPetition(null);
    }
  };

  const handleRejectPetition = async (petitionId) => {
    // Delete the rejected location
    const { error } = await supabase
      .from('Location')
      .delete()
      .eq('id', petitionId);
    
    if (error) {
      console.error('Error rejecting location petition:', error);
      return;
    }
    
    // Remove from petitions
    setPetitions(petitions.filter(p => p.id !== petitionId));
    
    // Close petition details if open
    if (selectedPetition && selectedPetition.id === petitionId) {
      setSelectedPetition(null);
    }
  };

  const handleViewPetitionDetails = (petition) => {
    setSelectedPetition(petition);
  };

  const [locationTypes, setLocationTypes] = useState([]);

  // Fetch location types
  useEffect(() => {
    const fetchLocationTypes = async () => {
      const { data, error } = await supabase
        .from('LocationType')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching location types:', error);
        return;
      }
      
      setLocationTypes(data || []);
    };
    
    fetchLocationTypes();
  }, []);

  // Then replace the hardcoded areas array
  const areas = ['Todas las zonas', ...locationTypes.map(type => type.name)];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Locales</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
              viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            <ListFilter size={18} />
            <span>Tabla</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
              viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            <MapIcon size={18} />
            <span>Mapa</span>
          </button>
          <button 
            onClick={() => setShowPetitionsSection(!showPetitionsSection)}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ml-2 relative"
          >
            <Bell size={18} />
            {petitions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {petitions.length}
              </span>
            )}
            <span>Peticiones</span>
          </button>
        </div>
      </div>

      {/* Petitions Section */}
      {showPetitionsSection && (
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Peticiones Pendientes</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {petitions.length} peticiones
              </span>
            </div>
            
            {petitions.length > 0 ? (
              <div className="space-y-4">
                {petitions.map(petition => (
                  <div key={petition.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{petition.name}</h3>
                        <p className="text-sm text-gray-500">{petition.address}</p>
                        <p className="text-xs text-gray-400 mt-1">Solicitado: {petition.requestDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewPetitionDetails(petition)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                        >
                          Detalles
                        </button>
                        <button 
                          onClick={() => handleAcceptPetition(petition)}
                          className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleRejectPetition(petition.id)}
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No hay peticiones pendientes</p>
            )}
          </div>
        </div>
      )}

      {/* Petition Details Modal */}
      {selectedPetition && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Detalles de la Petición</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Local</label>
                <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.schedule}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.area}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                  <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.longitude}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                  <p className="w-full px-3 py-2 border rounded-lg">{selectedPetition.latitude}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                  onClick={() => setSelectedPetition(null)}
                >
                  Cerrar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
                  onClick={() => handleRejectPetition(selectedPetition.id)}
                >
                  <X size={16} />
                  Rechazar
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                  onClick={() => handleAcceptPetition(selectedPetition)}
                >
                  <Check size={16} />
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center px-3 py-2 bg-white rounded-lg border flex-1 min-w-64">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar locales..."
            className="border-none outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative min-w-40">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border cursor-pointer">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="border-none outline-none w-full bg-transparent cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === 'Todos' ? 'Todos' : Number(e.target.value))}
            >
              {statuses.map(status => (
                <option key={status.code} value={status.code}>{status.text}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative min-w-40">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border cursor-pointer">
            <MapPin size={18} className="text-gray-400" />
            <select 
              className="border-none outline-none w-full bg-transparent cursor-pointer"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex-grow overflow-auto bg-white rounded-lg">
          {filteredLocations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table content - existing code */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.schedule}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.area}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <div>{location.phone}</div>
                        <div className="text-xs">{location.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        location.status === 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(location.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.visits} visitas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleEdit(location)}
                          className="text-blue-600 hover:text-blue-900">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(location.id)}
                          className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p>No se encontraron locales con los filtros actuales</p>
            </div>
          )}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="flex-grow bg-white rounded-lg overflow-hidden">
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      {/* Modal for Add/Edit Location - Include coordinates fields */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentLocation.id ? 'Editar Local' : 'Añadir Nuevo Local'}
            </h2>
            
            <div className="space-y-4">
              {/* Existing fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({...currentLocation, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentLocation.address}
                  onChange={(e) => setCurrentLocation({...currentLocation, address: e.target.value})}
                />
              </div>

              {/* New coordinate fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={currentLocation.longitude || ''}
                    onChange={(e) => setCurrentLocation({
                      ...currentLocation, 
                      longitude: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={currentLocation.latitude || ''}
                    onChange={(e) => setCurrentLocation({
                      ...currentLocation, 
                      latitude: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              {/* Rest of the existing form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <Phone size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="w-full outline-none"
                      placeholder="Ej: +34 911 234 567"
                      value={currentLocation.phone}
                      onChange={(e) => setCurrentLocation({...currentLocation, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={currentLocation.status}
                    onChange={(e) => setCurrentLocation({...currentLocation, status: Number(e.target.value)})}
                  >
                    <option value={2}>Activo</option>
                    <option value={3}>Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Rest of the form continues... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentLocation.email}
                  onChange={(e) => setCurrentLocation({...currentLocation, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Clock size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full outline-none"
                    placeholder="Ej: L-V: 9:00-20:00, S-D: 10:00-14:00"
                    value={currentLocation.schedule}
                    onChange={(e) => setCurrentLocation({...currentLocation, schedule: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  value={currentLocation.description}
                  onChange={(e) => setCurrentLocation({...currentLocation, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg"
                  onChange={(e) => setCurrentLocation({...currentLocation, image: e.target.files[0]})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Local</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentLocation.location_type || ''}
                  onChange={(e) => setCurrentLocation({
                    ...currentLocation, 
                    location_type: e.target.value ? parseInt(e.target.value) : null,
                    area: locationTypes.find(t => t.id === parseInt(e.target.value))?.name || 'Sin categoría'
                  })}
                >
                  <option value="">Seleccionar tipo</option>
                  {locationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleSave}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsContent;