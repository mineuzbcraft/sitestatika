import { useState } from "react";
import { X, ShieldCheck, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { getAdminUsername, updateCredentials, logout } from "../utils/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSettings({ open, onClose, onLogout }: Props) {
  const [username, setUsername] = useState(getAdminUsername());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSave() {
    setError("");
    if (!username.trim()) { setError("Foydalanuvchi nomi bo'sh bo'lishi mumkin emas"); return; }
    if (password && password.length < 6) { setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak"); return; }
    if (password && password !== confirm) { setError("Parollar mos kelmadi"); return; }
    if (!password) { setError("Yangi parol kiriting"); return; }
    updateCredentials(username.trim(), password);
    setSaved(true);
    setPassword("");
    setConfirm("");
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogoutClick() {
    logout();
    onLogout();
    onClose();
  }

  const passwordsMatch = password && confirm && password === confirm;
  const passwordMismatch = password && confirm && password !== confirm;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="bg-[#1e3a5f] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={22} className="text-blue-200" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Sozlamalari</p>
              <p className="text-blue-300 text-xs">Login va parolni o'zgartirish</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-blue-200" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Foydalanuvchi nomi</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); setSaved(false); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username..."
              autoComplete="off"
            />
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Yangi parol</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); setSaved(false); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yangi parol..."
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parolni tasdiqlash</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(""); setSaved(false); }}
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  passwordMismatch
                    ? "border-red-400 focus:ring-red-300"
                    : passwordsMatch
                    ? "border-green-400 focus:ring-green-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Parolni qayta kiriting..."
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordsMatch && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Parollar mos keldi</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700 font-semibold">Muvaffaqiyatli saqlandi! Keyingi kirishda yangi ma'lumotlar ishlaydi.</p>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#2a4f80] text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Save size={15} />
            Saqlash
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-gray-400">yoki</span></div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors"
          >
            Admin sessiyasini tugatish
          </button>
        </div>
      </div>
    </div>
  );
}
