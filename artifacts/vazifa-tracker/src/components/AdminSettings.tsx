import { useState } from 'react';
import { X, Key, Save, Shield } from 'lucide-react';
import { ADMIN_PASSWORD_KEY, ADMIN_USERNAME_KEY } from '../utils/auth';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSettings({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState(localStorage.getItem(ADMIN_USERNAME_KEY) || 'admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSave = () => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (currentPassword !== storedPassword) {
      setError('Joriy parol xato!');
      setSuccess('');
      return;
    }

    if (newPassword.length < 4) {
      setError('Yangi parol kamida 4 belgidan iborat bo\'lishi kerak!');
      setSuccess('');
      return;
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    localStorage.setItem(ADMIN_USERNAME_KEY, newUsername);
    setError('');
    setSuccess('Parol va foydalanuvchi nomi muvaffaqiyatli o\'zgartirildi!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => {
        onClose();
        setSuccess('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Shield size={18} className='text-gray-500'/>
                <h2 className="text-base font-bold text-gray-800">Admin sozlamalari</h2>
            </div>
          
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <div>
                <label className="block text-xs text-gray-500 mb-1">Foydalanuvchi nomi</label>
                <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Joriy parol</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Yangi parol</ol>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-green-600">{success}</p>}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Save size={14} />
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
