import { useState, useEffect } from 'react';
import { Task } from './types';
import { onAuthChange, logout, User, login, register } from './utils/auth';
import { fetchData, saveData } from './utils/storage';
import MajmuaModal from './components/MajmuaModal';
import BajarilmaganPopup from './components/BajarilmaganPopup';
import AuthComponent from './components/AuthComponent';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setIsLoading(true);
            if (user) {
                setUser(user);
                const fetchedData = await fetchData();
                setTasks(fetchedData);
                // Simple admin check
                if (user.email === 'admin@msrfteam.com') {
                    setIsAdmin(true);
                }
            } else {
                setUser(null);
                setTasks([]);
                setIsAdmin(false);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = (task: Omit<Task, 'id'> & { id?: string }) => {
        const updatedTasks = task.id
            ? tasks.map(t => t.id === task.id ? { ...t, ...task } : t)
            : [...tasks, { ...task, id: Date.now().toString() }];

        setTasks(updatedTasks);
        saveData(updatedTasks);
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleUpdate = (updatedTask: Task) => {
        const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        setTasks(updatedTasks);
        saveData(updatedTasks);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <AuthComponent onLogin={login} onRegister={register} />;
    }

    return (
        <div className="App">
            <h1>Vazifa Tracker</h1>
            <button onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
            }}>Yangi vazifa qo'shish</button>
            <button onClick={() => setIsPopupOpen(true)}>Bajarilmagan vazifalarni ko'rish</button>
            <button onClick={logout}>Chiqish</button>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <h2>{task.nomi}</h2>
                        <p>Mas'ul: {task.masul}</p>
                        <button onClick={() => {
                            setSelectedTask(task);
                            setIsModalOpen(true);
                        }}>Tahrirlash</button>
                    </div>
                ))}
            </div>

            <MajmuaModal
                open={isModalOpen}
                initial={selectedTask}
                onSave={handleSave}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                }}
            />

            <BajarilmaganPopup
                open={isPopupOpen}
                majmua={tasks.length > 0 ? tasks[0] : null} // Pass a task to the popup
                isAdmin={isAdmin}
                onClose={() => setIsPopupOpen(false)}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default App;
