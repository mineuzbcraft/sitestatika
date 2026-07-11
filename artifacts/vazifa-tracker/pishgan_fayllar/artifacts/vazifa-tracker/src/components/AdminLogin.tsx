import { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { login } from "../utils/auth";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminLogin({ open, onSuccess, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (!open) return null;

  function handleLogin() {
    if (login(username, password)) {
      setUsername("");
      setPassword("");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleClose() {
    setUsername("");
    setPassword("");
    setError(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm ${shake ? "animate-bounce" : ""}`}>
        <div className="bg-[#1e3a5f] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={22} className="text-blue-200" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Panel</p>
              <p className="text-blue-300 text-xs">Faqat vakolatli foydalanuvchilar</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-blue-200" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Foydalanuvchi nomi</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                error ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Username..."
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parol</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  error ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Parol..."
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <Lock size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">Noto'g'ri foydalanuvchi nomi yoki parol</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!username || !password}
            className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#2a4f80] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors"
          >
            Kirish
          </button>
        </div>
      </div>
    </div>
  );
}
