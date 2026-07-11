import React, { useState } from 'react';
import Modal from './components/Modal';
import TaskList from './components/TaskList';

// --- Mock Data ---
type Majmua = {
  id: number;
  name: string;
  manager: string;
  managerImg?: string; // Optional image for manager
  tasks: {
    id: number;
    name: string;
    source: string;
    status: 'pending' | 'completed';
  }[];
  stats: {
    uncompleted: number;
    total: number;
  };
};

const majmualar: Majmua[] = [
  {
    id: 1,
    name: 'Xotin-qizlar majmuasi',
    manager: 'M.Aripov',
    tasks: [
      { id: 1, name: 'Mahalla komissiyasi...', source: 'Ko\'rsatilmagan', status: 'pending' },
      { id: 2, name: 'Xorijiy tajriba o\'rganish', source: 'Ko\'rsatilmagan', status: 'pending' },
      { id: 3, name: 'Yillik natijalar taqdimoti', source: 'Ko\'rsatilmagan', status: 'pending' },
    ],
    stats: { uncompleted: 3, total: 10 },
  },
  {
    id: 2,
    name: 'Iqtisod majmuasi',
    manager: 'A.Azimov',
    tasks: [],
    stats: { uncompleted: 3, total: 10 },
  },
    {
    id: 3,
    name: 'Qurilish va kommunal majmuasi',
    manager: 'N.Ismatov',
    tasks: [],
    stats: { uncompleted: 7, total: 10 },
  },
  {
    id: 4,
    name: 'Investitsiya majmuasi',
    manager: 'S.Abdika',
    tasks: [],
    stats: { uncompleted: 3, total: 10 },
  },
  {
    id: 5,
    name: 'Ijtimoiy majmua',
    manager: 'O.Raxmonov',
    tasks: [],
    stats: { uncompleted: 8, total: 10 },
  },
  {
    id: 6,
    name: 'Mahalla',
    manager: 'O.Yusupov',
    tasks: [],
    stats: { uncompleted: 1, total: 3 },
  },
];

// --- App Component ---
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajmua, setSelectedMajmua] = useState<Majmua | null>(null);

  const handleRowClick = (majmua: Majmua) => {
    setSelectedMajmua(majmua);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMajmua(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Vazifalar Nazorat Tizimi</h1>
          <p className="text-sm text-gray-400">Majmualar va mas'ul shaxslar bo'yicha hisobot</p>
        </div>
        {/* ... header buttons ... */}
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* ... stats ... */}

        {/* Table */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Table */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-left">T/r</th>
                  <th className="p-3 text-left">Majmua nomi</th>
                  <th className="p-3 text-left">Mas'ul shaxs</th>
                </tr>
              </thead>
              <tbody>
                {majmualar.map((majmua, index) => (
                  <tr key={majmua.id} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleRowClick(majmua)}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{majmua.name}</td>
                    <td className="p-3">{majmua.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Table */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-left">Bajarilmagan</th>
                  <th className="p-3 text-left">Jami</th>
                  <th className="p-3 text-left">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {majmualar.map((majmua) => (
                  <tr key={majmua.id}>
                    <td className="p-3"><span className='bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full'>{majmua.stats.uncompleted}</span></td>
                    <td className="p-3">{majmua.stats.total}</td>
                    <td className="p-3 flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">&#9998;</button> {/* Edit Icon */}
                      <button className="text-red-400 hover:text-red-300">&#128465;</button> {/* Delete Icon */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedMajmua && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`Bajarilmagan vazifalar: ${selectedMajmua.name}`}>
           <TaskList tasks={selectedMajmua.tasks} />
        </Modal>
      )}
    </div>
  );
};

export default App;
