
import { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck, UserPlus, KeyRound } from "lucide-react";
import { login } from "../utils/auth";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminLogin({ open, onSuccess, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  if (!open) return null;

  async function handleLogin() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      // Yangi Firebase login funksiyasini ishlatish
      await login(email, password);
      setEmail("");
      setPassword("");
      onSuccess();
    } catch (err: any) {
      // Firebase xatolarini ushlash
      let errorMessage = "Kirishda noma'lum xatolik.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === 'auth/invalid-credential') {
        errorMessage = "Noto'g'ri email yoki parol.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Email formati noto'g'ri.";
      }
      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  }

  function handleClose() {
    setEmail("");
    setPassword("");
    setError(null);
    onClose();
  }

  function showAdminMessage(feature: string) {
    alert(`${feature} uchun adminga murojaat qiling: @Msrfteam`);
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
              <p className="text-white font-bold text-sm">Tizimga kirish</p>
              <p className="text-blue-300 text-xs">Vakolatli foydalanuvchilar uchun</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-blue-200" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                error ? "border-red-400 focus:ring-red-300 bg-red-50" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Email..."
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parol</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
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
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#2a4f80] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center"
          >
            {loading ? <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div> : "Kirish"}
          </button>

          <div className="text-center text-xs text-gray-500 pt-2 space-x-2">
             <button onClick={() => showAdminMessage('Ro\'yxatdan o\'tish')} className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline">
                <UserPlus size={12}/>
                Ro'yxatdan o'tish
             </button>
             <span>|</span>
             <button onClick={() => showAdminMessage('Parolni tiklash')} className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline">
                <KeyRound size={12}/>
                Parolni unutdingizmi?
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
