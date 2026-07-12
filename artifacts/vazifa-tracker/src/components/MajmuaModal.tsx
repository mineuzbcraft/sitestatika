import { useState, useEffect } from 'react';
import type { Task, SubTask } from '../types';

interface Props {
    open: boolean;
    initial: Task | null;
    onSave: (task: Omit<Task, 'id'> & { id?: string }) => void;
    onClose: () => void;
}

const MajmuaModal = ({ open, initial, onSave, onClose }: Props) => {
    const [nomi, setNomi] = useState('');
    const [masul, setMasul] = useState('');
    const [izoh, setIzoh] = useState('');
    const [vazifalar, setVazifalar] = useState<SubTask[]>([]);

    useEffect(() => {
        if (initial) {
            setNomi(initial.nomi);
            setMasul(initial.masul);
            setIzoh(initial.izoh);
            setVazifalar(initial.vazifalar);
        } else {
            setNomi('');
            setMasul('');
            setIzoh('');
            setVazifalar([]);
        }
    }, [initial]);

    const handleSave = () => {
        const taskData = { nomi, masul, izoh, vazifalar };
        if (initial?.id) {
            onSave({ ...taskData, id: initial.id });
        } else {
            onSave(taskData);
        }
    };

    if (!open) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{initial ? 'Vazifani Tahrirlash' : 'Yangi Vazifa Qo\'shish'}</h2>
                <input type="text" placeholder="Nomi" value={nomi} onChange={e => setNomi(e.target.value)} />
                <input type="text" placeholder="Mas'ul" value={masul} onChange={e => setMasul(e.target.value)} />
                <textarea placeholder="Izoh" value={izoh} onChange={e => setIzoh(e.target.value)}></textarea>
                <button onClick={handleSave}>Saqlash</button>
                <button onClick={onClose}>Yopish</button>
            </div>
        </div>
    );
};

export default MajmuaModal;
