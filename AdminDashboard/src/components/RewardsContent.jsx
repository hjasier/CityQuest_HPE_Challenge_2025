import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Award, Calendar, Tag, Check, X, Gift, Coins } from 'lucide-react';

// Initial rewards data with points cost instead of challenge-based
const initialRewards = [
  {
    id: 1,
    name: 'Descuento 20% Café Central',
    description: 'Descuento del 20% en consumiciones en Café Central',
    pointsCost: 150,
    type: 'Descuento',
    value: '20%',
    expiryDays: 30,
    status: 'Activo',
    redemptions: 124,
    image: null
  },
  {
    id: 2,
    name: 'Entrada gratuita al Museo de Arte',
    description: 'Una entrada gratuita al Museo de Arte Contemporáneo',
    pointsCost: 200,
    type: 'Gratuidad',
    value: 'Entrada individual',
    expiryDays: 60,
    status: 'Activo',
    redemptions: 87,
    image: null
  },
  {
    id: 3,
    name: 'Puntos premium x2',
    description: 'Duplica tus puntos en la siguiente visita a cualquier local participante',
    pointsCost: 300,
    type: 'Puntos',
    value: 'Puntos x2',
    expiryDays: 15,
    status: 'Inactivo',
    redemptions: 45,
    image: null
  },
  {
    id: 4,
    name: 'Menú degustación gratis',
    description: 'Menú degustación gratuito para 2 personas en Restaurante El Mirador',
    pointsCost: 500,
    type: 'Gratuidad',
    value: 'Menú para 2',
    expiryDays: 45,
    status: 'Activo',
    redemptions: 18,
    image: null
  }
];

const RewardsContent = () => {
  const [rewards, setRewards] = useState(initialRewards);
  const [filteredRewards, setFilteredRewards] = useState(initialRewards);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterType, setFilterType] = useState('Todos');

  const rewardTypes = ['Todos', 'Descuento', 'Gratuidad', 'Puntos', 'Producto'];
  const statuses = ['Todos', 'Activo', 'Inactivo'];

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
    
    if (filterType !== 'Todos') {
      filtered = filtered.filter(reward => reward.type === filterType);
    }
    
    setFilteredRewards(filtered);
  }, [searchTerm, filterStatus, filterType, rewards]);

  // Open modal to add new reward
  const handleAddNew = () => {
    setCurrentReward({
      id: rewards.length + 1,
      name: '',
      description: '',
      pointsCost: 100,
      type: 'Descuento',
      value: '',
      expiryDays: 30,
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
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este premio?')) {
      setRewards(rewards.filter(reward => reward.id !== id));
    }
  };

  // Save changes (new reward or edit)
  const handleSave = () => {
    if (rewards.some(r => r.id === currentReward.id)) {
      // Update existing reward
      setRewards(rewards.map(r => 
        r.id === currentReward.id ? currentReward : r
      ));
    } else {
      // Add new reward
      setRewards([...rewards, currentReward]);
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

        <div className="relative min-w-40">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border cursor-pointer">
            <Gift size={18} className="text-gray-400" />
            <select 
              className="border-none outline-none w-full bg-transparent cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {rewardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <div className="flex-grow overflow-auto bg-white rounded-lg">
        {filteredRewards.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo en Puntos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiración</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canjes</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reward.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reward.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reward.expiryDays} días
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
              {currentReward.redemptions === 0 ? 'Añadir Nuevo Premio' : 'Editar Premio'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de premio</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={currentReward.type}
                    onChange={(e) => setCurrentReward({...currentReward, type: e.target.value})}
                  >
                    {rewardTypes.slice(1).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <Tag size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="w-full outline-none"
                      placeholder="Ej: 20%, 10€, Entrada gratis..."
                      value={currentReward.value}
                      onChange={(e) => setCurrentReward({...currentReward, value: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Días de expiración</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <input
                      type="number"
                      min="1"
                      className="w-full outline-none"
                      value={currentReward.expiryDays}
                      onChange={(e) => setCurrentReward({
                        ...currentReward, 
                        expiryDays: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
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