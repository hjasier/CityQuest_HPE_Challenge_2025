import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Award, Check, X, Coins } from 'lucide-react';
import { supabase } from '../hooks/supabaseClient';

const RewardsContent = () => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const statuses = ['Todos', 'Activo', 'Inactivo'];

  // Fetch rewards from Supabase
  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('Prize')
        .select('*');
      
      if (error) {
        console.error('Error fetching rewards:', error);
        setLoading(false);
        return;
      }
      
      // Transform the database data to match our component's expected format
      const formattedRewards = data.map(prize => ({
        id: prize.id,
        name: prize.name || prize.description.substring(0, 30) + '...', // Use description as name if not provided
        description: prize.description,
        pointsCost: prize.price,
        status: prize.status || 'Activo', // Default status if not in database
        redemptions: prize.redemptions || 0, // Default redemptions if not in database
        couponCode: prize.coupon_code,
        image: prize.image_url || null // Default image if not in database
      }));
      
      setRewards(formattedRewards);
      setFilteredRewards(formattedRewards);
      setLoading(false);
    };
    
    fetchRewards();
  }, []);

  // Filter rewards based on search and filters
  useEffect(() => {
    let filtered = rewards;
    
    if (searchTerm) {
      filtered = filtered.filter(reward => 
        reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'Todos') {
      filtered = filtered.filter(reward => reward.status === filterStatus);
    }
    
    setFilteredRewards(filtered);
  }, [searchTerm, filterStatus, rewards]);

  // Open modal to add new reward
  const handleAddNew = () => {
    setCurrentReward({
      id: null, // Let Supabase generate the ID
      name: '',
      description: '',
      pointsCost: 100,
      status: 'Activo',
      redemptions: 0,
      image: null
    });
    setShowModal(true);
  };

  // Open modal to edit existing reward
  const handleEdit = (reward) => {
    setCurrentReward({...reward});
    setShowModal(true);
  };

  // Delete reward
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este premio?')) {
      const { error } = await supabase
        .from('Prize')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting reward:', error);
        return;
      }
      
      setRewards(rewards.filter(reward => reward.id !== id));
    }
  };

  // Save changes (new reward or edit)
  const handleSave = async () => {
    // Prepare data for Supabase
    const prizeData = {
      price: currentReward.pointsCost,
      description: currentReward.description,
      name: currentReward.name,
      status: currentReward.status,
      redemptions: currentReward.redemptions
      // Note: coupon_code is generated automatically by the database
    };

    if (currentReward.id) {
      // Update existing reward
      const { data, error } = await supabase
        .from('Prize')
        .update(prizeData)
        .eq('id', currentReward.id)
        .select();
      
      if (error) {
        console.error('Error updating reward:', error);
        return;
      }
      
      // Update local state
      if (data && data[0]) {
        const updatedReward = {
          ...currentReward,
          couponCode: data[0].coupon_code
        };
        
        setRewards(rewards.map(r => 
          r.id === currentReward.id ? updatedReward : r
        ));
      }
    } else {
      // Add new reward
      const { data, error } = await supabase
        .from('Prize')
        .insert(prizeData)
        .select();
      
      if (error) {
        console.error('Error adding reward:', error);
        return;
      }
      
      // Add to local state with DB-generated ID and coupon code
      if (data && data[0]) {
        const newReward = {
          ...currentReward,
          id: data[0].id,
          couponCode: data[0].coupon_code
        };
        
        setRewards([...rewards, newReward]);
      }
    }
    
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Premios</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Añadir Premio</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center px-3 py-2 bg-white rounded-lg border flex-1 min-w-64">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar premios..."
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

      {/* Rewards List */}
      <div className="flex-grow overflow-auto bg-white rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRewards.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo en Puntos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canjes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{reward.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{reward.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {reward.pointsCost} trotamundis
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reward.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reward.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reward.redemptions} canjes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-xs font-mono">{reward.couponCode?.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(reward)}
                        className="text-blue-600 hover:text-blue-900">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(reward.id)}
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
            <p>No se encontraron premios con los filtros actuales</p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Reward */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentReward.id ? 'Editar Premio' : 'Añadir Nuevo Premio'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Premio</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentReward.name}
                  onChange={(e) => setCurrentReward({...currentReward, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  value={currentReward.description}
                  onChange={(e) => setCurrentReward({...currentReward, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo en Puntos</label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Coins size={18} className="text-gray-400 mr-2" />
                  <input
                    type="number"
                    min="0"
                    step="5"
                    className="w-full outline-none"
                    value={currentReward.pointsCost}
                    onChange={(e) => setCurrentReward({
                      ...currentReward, 
                      pointsCost: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={currentReward.status}
                  onChange={(e) => setCurrentReward({...currentReward, status: e.target.value})}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg"
                  onChange={(e) => setCurrentReward({...currentReward, image: e.target.files[0]})}
                />
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

export default RewardsContent;