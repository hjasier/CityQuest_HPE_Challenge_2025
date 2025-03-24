import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Settings, ChevronDown, Clock, Users } from 'lucide-react';

// Datos de ejemplo para los retos
const initialChallenges = [
  {
    id: 1,
    title: 'Visita los 3 museos principales',
    description: 'Completa visitas a Museo de Historia, Museo de Arte Contemporáneo y Galería Municipal',
    points: 150,
    difficulty: 'Medio',
    duration: '4 horas',
    status: 'Activo',
    completions: 243,
    abandonment: 18,
    category: 'Cultural'
  },
  {
    id: 2,
    title: 'Ruta gastronómica local',
    description: 'Visita al menos 4 restaurantes locales de la ruta gastronómica oficial',
    points: 100,
    difficulty: 'Fácil',
    duration: '3 horas',
    status: 'Activo',
    completions: 412,
    abandonment: 26,
    category: 'Gastronomía'
  },
  {
    id: 3,
    title: 'Descubre los monumentos históricos',
    description: 'Encuentra y fotografía los 5 monumentos históricos señalados en el mapa',
    points: 75,
    difficulty: 'Fácil',
    duration: '2 horas',
    status: 'Inactivo',
    completions: 156,
    abandonment: 34,
    category: 'Histórico'
  },
  {
    id: 4,
    title: 'Tour fotográfico de street art',
    description: 'Encuentra los 8 murales de artistas reconocidos distribuidos por la zona artística',
    points: 200,
    difficulty: 'Difícil',
    duration: '5 horas',
    status: 'Activo',
    completions: 87,
    abandonment: 42,
    category: 'Arte'
  }
];

const ChallengesContent = () => {
  const [challenges, setChallenges] = useState(initialChallenges);
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

  // Abrir modal para añadir nuevo reto
  const handleAddNew = () => {
    setCurrentChallenge({
      id: challenges.length + 1,
      title: '',
      description: '',
      points: 50,
      difficulty: 'Fácil',
      duration: '1 hora',
      status: 'Activo',
      completions: 0,
      abandonment: 0,
      category: 'Cultural'
    });
    setShowModal(true);
  };

  // Abrir modal para editar reto existente
  const handleEdit = (challenge) => {
    setCurrentChallenge({...challenge});
    setShowModal(true);
  };

  // Eliminar reto
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este reto?')) {
      setChallenges(challenges.filter(challenge => challenge.id !== id));
    }
  };

  // Guardar cambios (nuevo reto o edición)
  const handleSave = () => {
    if (challenges.some(c => c.id === currentChallenge.id)) {
      // Actualizar reto existente
      setChallenges(challenges.map(c => 
        c.id === currentChallenge.id ? currentChallenge : c
      ));
    } else {
      // Añadir nuevo reto
      setChallenges([...challenges, currentChallenge]);
    }
    setShowModal(false);
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
        {filteredChallenges.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <p>No se encontraron retos con los filtros actuales</p>
          </div>
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

    )};

export default ChallengesContent;