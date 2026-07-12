import { useState } from 'react';
import { BarChart3, Mail, KeyRound } from 'lucide-react';

type AuthComponentProps = {
  onLogin: (email: string, pass: string) => Promise<any>;
  onRegister: (email: string, pass: string) => Promise<any>;
};

export default function AuthComponent({ onLogin, onRegister }: AuthComponentProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email, password);
      } else {
        await onLogin(email, password);
      }
      // On success, the parent component will handle the user state change
    } catch (err: any) {
      console.error(err);
      // Provide more user-friendly error messages
      let message = 'Xatolik yuz berdi.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            message = 'Email yoki parol noto\'g\'ri.';
            break;
          case 'auth/invalid-email':
            message = 'Email formati noto\'g\'ri.';
            break;
          case 'auth/email-already-in-use':
            message = 'Bu email allaqachon ro\'yxatdan o\'tgan.';
            break;
          case 'auth/weak-password':
            message = 'Parol juda oddiy. Kamida 6 ta belgidan iborat bo\'lishi kerak.';
            break;
          default:
            message = 'Kirishda xatolik yuz berdi. Iltimos, qayta urunib ko\'ring.';
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <BarChart3 size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Tizimga kirish</h1>
          <p className="text-gray-500 text-sm mt-1">Vazifalarni boshqarishni boshlang</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              required
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isRegister ? "Ro'yxatdan o'tish" : "Kirish")}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isRegister ? "Akkauntingiz bormi?" : "Akkauntingiz yo'qmi?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="font-semibold text-blue-600 hover:underline"
            >
              {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </p>
        </form>

      </div>
    </div>
  );
}
