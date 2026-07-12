import { useState, useEffect } from 'react';
import type { SubTask } from '../types';

interface Props {
    open: boolean;
    subTask: SubTask | null;
    onClose: () => void;
    onSave: (subTask: SubTask) => void;
}

const BatafsliModal = ({ open, subTask, onClose, onSave }: Props) => {
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (subTask) {
            setDetails(subTask.details || '');
        } else {
            setDetails('');
        }
    }, [subTask]);

    const handleSave = () => {
        if (subTask) {
            onSave({ ...subTask, details });
        }
    };

    if (!open || !subTask) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{subTask.nomi} - Batafsil</h2>
                <textarea
                    placeholder="Batafsil ma'lumot"
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                ></textarea>
                <button onClick={handleSave}>Saqlash</button>
                <button onClick={onClose}>Yopish</button>
            </div>
        </div>
    );
};

export default BatafsliModal;
