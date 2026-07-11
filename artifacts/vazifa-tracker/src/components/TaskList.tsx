import React from 'react';

interface Task {
  id: number;
  name: string;
  source: string;
  status: 'pending' | 'completed';
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={task.id} className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center mr-4">{index + 1}</span>
              <h3 className="font-semibold">{task.name}</h3>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm bg-gray-700 px-2 py-1 rounded-md">+ Manba</button>
              <button className="text-sm text-blue-400">Batafsil ko'rish</button>
              <button className="text-sm text-yellow-400">Tahrirlash</button>
              <button className="text-sm text-red-400">PDF</button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>Tartib raqami: #{index + 1}</p>
            <p>Majmua: Xotin-qizlar majmuasi</p>
            <p>Mas'ul shaxs: M.Aripova</p>
            <p>Manba: {task.source}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500">Bajarildi deb belgilash</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
