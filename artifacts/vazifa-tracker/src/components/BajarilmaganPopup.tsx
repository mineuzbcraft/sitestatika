import { useState, useEffect } from 'react';
import type { Task, SubTask } from '../types';
import BatafsliModal from './BatafsliModal';

interface Props {
    open: boolean;
    majmua: Task | null;
    isAdmin: boolean;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

const BajarilmaganPopup = ({ open, majmua, isAdmin, onClose, onUpdate }: Props) => {
    const [bajarilmaganVazifalar, setBajarilmaganVazifalar] = useState<SubTask[]>([]);
    const [selectedSubTask, setSelectedSubTask] = useState<SubTask | null>(null);

    useEffect(() => {
        if (majmua) {
            const notDone = majmua.vazifalar.filter(v => !v.bajarildi);
            setBajarilmaganVazifalar(notDone);
        }
    }, [majmua]);

    const handleToggle = (subTaskId: string) => {
        if (!majmua) return;
        const updatedVazifalar = majmua.vazifalar.map(v =>
            v.id === subTaskId ? { ...v, bajarildi: !v.bajarildi } : v
        );
        const updatedMajmua = { ...majmua, vazifalar: updatedVazifalar };
        onUpdate(updatedMajmua);
    };

    if (!open || !majmua) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Bajarilmagan Vazifalar</h2>
                <ul>
                    {bajarilmaganVazifalar.map(vazifa => (
                        <li key={vazifa.id}>
                            {vazifa.nomi}
                            {isAdmin && <input type="checkbox" checked={vazifa.bajarildi} onChange={() => handleToggle(vazifa.id)} />}
                            <button onClick={() => setSelectedSubTask(vazifa)}>Batafsil</button>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>Yopish</button>
            </div>

            {selectedSubTask && (
                <BatafsliModal
                    open={!!selectedSubTask}
                    subTask={selectedSubTask}
                    onClose={() => setSelectedSubTask(null)}
                    onSave={(updatedSubTask) => {
                        if (!majmua) return;
                        const updatedVazifalar = majmua.vazifalar.map(v => v.id === updatedSubTask.id ? updatedSubTask : v);
                        const updatedMajmua = { ...majmua, vazifalar: updatedVazifalar };
                        onUpdate(updatedMajmua);
                        setSelectedSubTask(null);
                    }}
                />
            )}
        </div>
    );
};

export default BajarilmaganPopup;
