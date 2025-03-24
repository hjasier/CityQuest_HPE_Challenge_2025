import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Settings, ChevronDown, Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '../hooks/supabaseClient';

// completions and abandonment are hardcoded to 0 for now
const ChallengesContent = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [challengeTypes, setChallengeTypes] = useState([]);
  const [locations, setLocations] = useState([]); // Add this state for locations
  
  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('Location')
        .select('id, name, address, point');
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      console.log('Locations data:', data);
      setLocations(data || []);
    };
    
    fetchLocations();
  }, []);
  
  // Fetch challenge types
  useEffect(() => {
    const fetchChallengeTypes = async () => {
      const { data, error } = await supabase
        .from('ChallengeType')
        .select('*');
      
      if (error) {
        console.error('Error fetching challenge types:', error);
        return;
      }
      
      setChallengeTypes(data);
    };
    
    fetchChallengeTypes();
  }, []);
  
  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      
      // First try to get all challenge data without the inner join requirement
      const { data, error } = await supabase
        .from('Challenge')
        .select(`
          *,
          ChallengeType:type (type),
          Location:location (name, address)
        `);
      
      if (error) {
        console.error('Error fetching challenges:', error);
        setLoading(false);
        return;
      }
      
      console.log('Raw challenge data from Supabase:', data);
      
      if (!data || data.length === 0) {
        console.warn('No challenges found in database');
        setLoading(false);
        return;
      }
      
      // Map data to match component's expected structure
      const formattedChallenges = data.map(challenge => ({
        id: challenge.id,
        title: challenge.name || 'Sin título',
        description: challenge.description || 'Sin descripción',
        points: challenge.reward || 0,
        difficulty: calculateDifficulty(challenge.priority || 5),
        duration: challenge.cooldown_time ? `${challenge.cooldown_time} horas` : 'Sin límite',
        status: challenge.active ? 'Activo' : 'Inactivo',
        completions: 0, // You might want to fetch this from AcceptedChallenge
        abandonment: 0, // This would need a separate query
        category: challenge.ChallengeType?.type || 'Sin categoría',
        coverUrl: challenge.cover_url || '',
        type: challenge.type,
        location: challenge.location,
        repeatable: challenge.repeatable || false,
        expiration_date: challenge.expiration_date
      }));
      
      console.log('Formatted challenges:', formattedChallenges);
      setChallenges(formattedChallenges);
      setLoading(false);
    };
    
    fetchChallenges();
  }, []);

  // Helper function to convert priority to difficulty
  const calculateDifficulty = (priority) => {
    if (priority <= 3) return 'Fácil';
    if (priority <= 7) return 'Medio';
    return 'Difícil';
  };

  // Helper function to convert difficulty to priority
  const calculatePriority = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return 3;
      case 'Medio': return 6;
      case 'Difícil': return 9;
      default: return 5;
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');

  const statuses = ['Todos', 'Activo', 'Inactivo'];
  const difficulties = ['Fácil', 'Medio', 'Difícil'];
  const categories = ['Cultural', 'Gastronomía', 'Histórico', 'Arte', 'Naturaleza', 'Aventura'];

  // Función para filtrar retos
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || challenge.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Add new challenge - update to include location
  const handleAddNew = () => {
    setCurrentChallenge({
      id: null, // Let Supabase generate the ID
      title: '',
      description: '',
      points: 50,
      difficulty: 'Fácil',
      duration: '1 hora',
      status: 'Activo',
      completions: 0,
      abandonment: 0,
      category: challengeTypes.length > 0 ? challengeTypes[0].type : '',
      coverUrl: '',
      repeatable: false,
      location: null, // Initialize location as null
      expiration_date: new Date(Date.now() + 30*24*60*60*1000).toISOString() // 30 days from now
    });
    setShowModal(true);
  };

  // Abrir modal para editar reto existente
  const handleEdit = (challenge) => {
    setCurrentChallenge({...challenge});
    setShowModal(true);
  };

  // Save changes - update to include location
  const handleSave = async () => {
    const challengeData = {
      name: currentChallenge.title,
      description: currentChallenge.description,
      reward: currentChallenge.points,
      priority: calculatePriority(currentChallenge.difficulty),
      active: currentChallenge.status === 'Activo',
      type: challengeTypes.find(t => t.type === currentChallenge.category)?.id,
      cover_url: currentChallenge.coverUrl || 'https://placeholder.com/150',
      repeatable: currentChallenge.repeatable,
      cooldown_time: parseInt(currentChallenge.duration) || null,
      expiration_date: currentChallenge.expiration_date,
      location: currentChallenge.location // Add this line to include location ID
    };

    if (currentChallenge.id) {
      // Update existing challenge
      const { error } = await supabase
        .from('Challenge')
        .update(challengeData)
        .eq('id', currentChallenge.id);
      
      if (error) {
        console.error('Error updating challenge:', error);
        return;
      }

      setChallenges(challenges.map(c => 
        c.id === currentChallenge.id ? {...c, ...currentChallenge} : c
      ));
    } else {
      // Add new challenge
      const { data, error } = await supabase
        .from('Challenge')
        .insert(challengeData)
        .select();
      
      if (error) {
        console.error('Error adding challenge:', error);
        return;
      }

      const newChallenge = {
        ...currentChallenge,
        id: data[0].id
      };
      
      setChallenges([...challenges, newChallenge]);
    }
    
    setShowModal(false);
  };

  // Delete challenge
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este reto?')) {
      const { error } = await supabase
        .from('Challenge')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting challenge:', error);
        return;
      }
      
      setChallenges(challenges.filter(challenge => challenge.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Retos</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Añadir Reto</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center px-3 py-2 bg-white rounded-lg border flex-1 min-w-64">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar retos..."
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
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="flex-grow overflow-auto bg-white rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dificultad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChallenges.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{challenge.title}</div>
                      <div className="text-sm text-gray-500">{challenge.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{challenge.points} trotamundis</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{challenge.difficulty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{challenge.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      challenge.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <div>{challenge.completions} completados</div>
                      <div className="text-xs text-red-500">{challenge.abandonment} abandonos</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(challenge)}
                        className="text-blue-600 hover:text-blue-900">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(challenge.id)}
                        className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit Challenge */}
    {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">
            {currentChallenge.completions === 0 ? 'Añadir Nuevo Reto' : 'Editar Reto'}
        </h2>
        
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={currentChallenge.title}
                onChange={(e) => setCurrentChallenge({...currentChallenge, title: e.target.value})}
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                value={currentChallenge.description}
                onChange={(e) => setCurrentChallenge({...currentChallenge, description: e.target.value})}
            ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puntos</label>
                <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                    step="5"
                    value={currentChallenge.points}
                    onChange={(e) => setCurrentChallenge({...currentChallenge, points: parseInt(e.target.value)})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                <Clock size={18} className="text-gray-400 mr-2" />
                <input
                    type="text"
                    className="w-full outline-none"
                    placeholder="Ej: 2 horas"
                    value={currentChallenge.duration}
                    onChange={(e) => setCurrentChallenge({...currentChallenge, duration: e.target.value})}
                />
                </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                className="w-full px-3 py-2 border rounded-lg"
                value={currentChallenge.status}
                onChange={(e) => setCurrentChallenge({...currentChallenge, status: e.target.value})}
                >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={currentChallenge.difficulty}
                    onChange={(e) => setCurrentChallenge({...currentChallenge, difficulty: e.target.value})}
                >
                    {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                </select>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
                className="w-full px-3 py-2 border rounded-lg"
                value={currentChallenge.category}
                onChange={(e) => setCurrentChallenge({...currentChallenge, category: e.target.value})}
            >
                {categories.map(category => (
                <option key={category} value={category}>{category}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg"
                onChange={(e) => setCurrentChallenge({...currentChallenge, image: e.target.files[0]})}
            />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://example.com/image.jpg"
                value={currentChallenge.coverUrl || ''}
                onChange={(e) => setCurrentChallenge({...currentChallenge, coverUrl: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
                value={currentChallenge.expiration_date ? new Date(currentChallenge.expiration_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setCurrentChallenge({...currentChallenge, expiration_date: new Date(e.target.value).toISOString()})}
              />
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="repeatable"
                checked={currentChallenge.repeatable || false}
                onChange={(e) => setCurrentChallenge({...currentChallenge, repeatable: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="repeatable" className="ml-2 block text-sm text-gray-900">
                Reto repetible
              </label>
            </div>

            {/* Add this new location field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <select
                      className="w-full outline-none bg-transparent"
                      value={currentChallenge.location || ''}
                      onChange={(e) => setCurrentChallenge({
                        ...currentChallenge, 
                        location: e.target.value ? parseInt(e.target.value) : null
                      })}
                    >
                      <option value="">Sin ubicación específica</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} {location.address ? `- ${location.address}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
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

export default ChallengesContent;