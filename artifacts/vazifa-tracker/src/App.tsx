import { useState } from "react";
import { TaskList } from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState<{ id: number; text: string; time: string }[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: taskInput,
      time: new Date().toLocaleTimeString(),
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Vazifa Tracker</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Yangi vazifa qo'shish..."
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Qo'shish
          </button>
        </div>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

export default App;