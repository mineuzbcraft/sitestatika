import { useState, useEffect } from "react";
import type { Majmua } from "./types";
import { loadData, saveData, getAvailableMasullar } from "./utils/storage";
import { foizHisoblash, rangAniqla, RANG_STYLES, RANG_ROW_BG } from "./utils/foiz";
import { checkAdmin, logout } from "./utils/auth";
import MajmuaModal from "./components/MajmuaModal";
import BajarilmaganPopup from "./components/BajarilmaganPopup";
import ExportImport from "./components/ExportImport";
import AdminLogin from "./components/AdminLogin";
import AdminSettings from "./components/AdminSettings";
import { Plus, Edit2, Trash2, BarChart3, CheckCircle2, AlertCircle, XCircle, User, LogOut, ShieldCheck, Settings, Users } from "lucide-react";
import type { RangTuri } from "./utils/foiz";

type Filtr = "hammasi" | "ijobiy" | "qoniqarli" | "salbiy";

const HOLAT_LABEL: Record<RangTuri, { label: string; icon: React.ReactNode }> = {
  yashil: { label: "Ijobiy",    icon: <CheckCircle2 size={14} /> },
  sariq:  { label: "Qoniqarli", icon: <AlertCircle size={14} /> },
  qizil:  { label: "Salbiy",    icon: <XCircle size={14} /> },
};

export default function App() {
  const [availableMasullar, setAvailableMasullar] = useState<string[]>([]);
  const [masulFilter, setMasulFilter] = useState<string>("all");
  const [allMajmualar, setAllMajmualar] = useState<Majmua[]>([]);
  const [majmualar, setMajmualar] = useState<Majmua[]>([]); // Filtered list for display
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Majmua | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filtr, setFiltr] = useState<Filtr>("hammasi");
  const [popupMajmua, setPopupMajmua] = useState<Majmua | null>(null);
  const [admin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const masullar = getAvailableMasullar();
    setAvailableMasullar(masullar);
    
    const loadedMajmualar = masullar.flatMap(masul => loadData(masul));
    setAllMajmualar(loadedMajmualar);

    setAdmin(checkAdmin());
  }, []);

  // When filter or all data changes, update the displayed list
  useEffect(() => {
    if (masulFilter === "all") {
      setMajmualar(allMajmualar);
    } else {
      setMajmualar(allMajmualar.filter(m => m.masul === masulFilter));
    }
  }, [masulFilter, allMajmualar]);

  function handleSave(m: Majmua) {
    const newAllMajmualar = allMajmualar.find(x => x.id === m.id)
      ? allMajmualar.map(x => (x.id === m.id ? m : x))
      : [...allMajmualar, m];
    
    setAllMajmualar(newAllMajmualar);

    const masulToUpdate = m.masul;
    const subsetToSave = newAllMajmualar.filter(item => item.masul === masulToUpdate);
    saveData(masulToUpdate, subsetToSave);

    setModalOpen(false);
    setEditTarget(null);
  }

  function handleEdit(m: Majmua) {
    setEditTarget(m);
    setModalOpen(true);
  }

  function handleImport(importedMajmualar: Majmua[]) {
    const importedByMasul = importedMajmualar.reduce((acc, m) => {
        (acc[m.masul] = acc[m.masul] || []).push(m);
        return acc;
    }, {} as Record<string, Majmua[]>);

    const masulsInImport = Object.keys(importedByMasul);
    const unchangedMajmualar = allMajmualar.filter(m => !masulsInImport.includes(m.masul));
    const newAllMajmualar = [...unchangedMajmualar, ...importedMajmualar];
    setAllMajmualar(newAllMajmualar);

    for (const masul of masulsInImport) {
        saveData(masul, importedByMasul[masul]);
    }
  }

  function handleDelete(id: string) {
    const itemToDelete = allMajmualar.find(x => x.id === id);
    if (!itemToDelete) return;

    const newAllMajmualar = allMajmualar.filter(x => x.id !== id);
    setAllMajmualar(newAllMajmualar);
    
    const masulToUpdate = itemToDelete.masul;
    const subsetToSave = newAllMajmualar.filter(item => item.masul === masulToUpdate);
    saveData(masulToUpdate, subsetToSave);

    setDeleteId(null);
  }

  function handlePopupUpdate(updated: Majmua) {
    const newAllMajmualar = allMajmualar.map(m => m.id === updated.id ? updated : m);
    setAllMajmualar(newAllMajmualar);
    
    const masulToUpdate = updated.masul;
    const subsetToSave = newAllMajmualar.filter(item => item.masul === masulToUpdate);
    saveData(masulToUpdate, subsetToSave);

    setPopupMajmua(updated);
  }

  function handleLogout() {
    logout();
    setAdmin(false);
  }

  const umumiyFoiz = majmualar.length === 0 ? 0 : Math.round(
    majmualar.reduce((acc, m) => {
      return acc + foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length);
    }, 0) / majmualar.length
  );

  const umumiyRang = rangAniqla(umumiyFoiz);
  const totalVazifa = majmualar.reduce((a, m) => a + m.vazifalar.length, 0);
  const bajarilganVazifa = majmualar.reduce((a, m) => a + m.vazifalar.filter(v => v.bajarildi).length, 0);

  const filtrlanganlar = majmualar.filter(m => {
    if (filtr === "hammasi") return true;
    const foiz = foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length);
    const rang = rangAniqla(foiz);
    if (filtr === "ijobiy")    return rang === "yashil";
    if (filtr === "qoniqarli") return rang === "sariq";
    if (filtr === "salbiy")    return rang === "qizil";
    return true;
  });

  const counts = {
    ijobiy:    majmualar.filter(m => rangAniqla(foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length)) === "yashil").length,
    qoniqarli: majmualar.filter(m => rangAniqla(foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length)) === "sariq").length,
    salbiy:    majmualar.filter(m => rangAniqla(foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length)) === "qizil").length,
  };

  const FILTR_TUGMALAR: { key: Filtr; label: string; count: number; cls: string; active: string }[] = [
    { key: "hammasi",   label: "Hammasi",   count: majmualar.length, cls: "bg-gray-100 text-gray-700 hover:bg-gray-200",       active: "bg-[#1e3a5f] text-white" },
    { key: "ijobiy",    label: "Ijobiy",    count: counts.ijobiy,    cls: "bg-green-100 text-green-700 hover:bg-green-200",     active: "bg-green-600 text-white" },
    { key: "qoniqarli", label: "Qoniqarli", count: counts.qoniqarli, cls: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200", active: "bg-yellow-500 text-white" },
    { key: "salbiy",    label: "Salbiy",    count: counts.salbiy,    cls: "bg-red-100 text-red-700 hover:bg-red-200",           active: "bg-red-600 text-white" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BarChart3 size={28} className="text-blue-300" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Vazifalar Nazorat Tizimi</h1>
                <p className="text-blue-300 text-xs mt-0.5">Majmualar va mas'ul shaxslar bo'yicha hisobot</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Masul Filter */}
              <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-300"/>
                  <select 
                      value={masulFilter} 
                      onChange={(e) => setMasulFilter(e.target.value)}
                      className="bg-[#1a3455] text-white text-sm font-medium rounded-lg border-blue-800/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full p-2 appearance-none"
                  >
                      <option value="all">Barcha mas'ullar</option>
                      {availableMasullar.map(masul => (
                          <option key={masul} value={masul}>{masul}</option>
                      ))}
                  </select>
              </div>

              {/* Admin badge */}
              {admin && (
                <div className="flex items-center gap-1.5 bg-emerald-700/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={14} className="text-emerald-300" />
                  <span className="text-xs font-semibold text-emerald-200">Admin</span>
                </div>
              )}

              {/* Export/Import — admin only */}
              {admin && <ExportImport majmualar={majmualar} onImport={handleImport} isAdmin={admin} />}

              {/* Admin-only: add new */}
              {admin && (
                <button
                  onClick={() => { setEditTarget(null); setModalOpen(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus size={16} />
                  Yangi qo'shish
                </button>
              )}

              {/* Settings */}
              {admin && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  title="Admin sozlamalari"
                >
                  <Settings size={15} />
                </button>
              )}

              {/* Logout */}
              {admin && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  title="Chiqish"
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats + Filter bar */}
      {majmualar.length > 0 && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="font-medium">Jami:</span>
              <span className="font-bold text-gray-900">{majmualar.length}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <CheckCircle2 size={15} className="text-green-500" />
              <span className="font-medium">Bajarildi:</span>
              <span className="font-bold text-green-700">{bajarilganVazifa}/{totalVazifa}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Umumiy:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-sm ${RANG_STYLES[umumiyRang].bg} ${RANG_STYLES[umumiyRang].text}`}>
                {umumiyFoiz}%
              </span>
            </div>
            <div className="flex-1 min-w-[100px]">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${RANG_STYLES[umumiyRang].bg}`}
                  style={{ width: `${umumiyFoiz}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {FILTR_TUGMALAR.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltr(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filtr === f.key ? f.active : f.cls}`}
                >
                  {f.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filtr === f.key ? "bg-white/20" : "bg-black/10"}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {allMajmualar.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 size={36} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Hali majmua yo'q</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              {admin ? "Birinchi majmuani qo'shing va vazifalarni kuzatishni boshlang" : "Tizimda hozircha ma'lumot yo'q"}
            </p>
            {admin && (
              <button
                onClick={() => { setEditTarget(null); setModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
              >
                <Plus size={18} />
                Birinchi majmuani qo'shish
              </button>
            )}
          </div>
        ) : (
          <>
            {filtrlanganlar.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow border border-gray-200">
                <p className="text-gray-500 font-medium">Bu filtr bo'yicha hech narsa topilmadi</p>
                <button onClick={() => setFiltr("hammasi")} className="mt-3 text-blue-600 text-sm underline">Hammasini ko'rish</button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e3a5f] text-white">
                      <th className="px-4 py-3.5 text-center text-sm font-bold w-12 border-r border-blue-700">T/r</th>
                      <th className="px-4 py-3.5 text-left text-sm font-bold border-r border-blue-700">Majmua nomi</th>
                      <th className="px-4 py-3.5 text-left text-sm font-bold border-r border-blue-700">Mas'ul shaxs</th>
                      <th className="px-4 py-3.5 text-left text-sm font-bold border-r border-blue-700">Izoh</th>
                      <th className="px-4 py-3.5 text-center text-sm font-bold border-r border-blue-700 w-32">Holat</th>
                      <th className="px-4 py-3.5 text-center text-sm font-bold border-r border-blue-700 w-20">Foiz</th>
                      <th className="px-4 py-3.5 text-center text-sm font-bold border-r border-blue-700 w-32" title="Bajarilmagan vazifalar — bosib ko'ring">
                        Bajarilmagan
                      </th>
                      <th className="px-4 py-3.5 text-center text-sm font-bold border-r border-blue-700 w-20">Jami</th>
                      {admin && (
                        <th className="px-4 py-3.5 text-center text-sm font-bold w-20">Amallar</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrlanganlar.map((m, i) => {
                      const jami = m.vazifalar.length;
                      const done = m.vazifalar.filter(v => v.bajarildi).length;
                      const notDoneCount = jami - done;
                      const foiz = foizHisoblash(jami, done);
                      const rang = rangAniqla(foiz);
                      const styles = RANG_STYLES[rang];
                      const rowBg = RANG_ROW_BG[rang];
                      const holat = HOLAT_LABEL[rang];

                      return (
                        <tr key={m.id} className={`${rowBg} border-t border-gray-200 hover:brightness-95 transition-all`}>
                          <td className="px-4 py-4 text-center font-bold text-gray-700 border-r border-gray-200 text-sm">
                            {i + 1}
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200">
                            <span className="font-semibold text-gray-800 text-sm">{m.nomi}</span>
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200">
                            <div className="flex items-center gap-2.5">
                              {m.rasm ? (
                                <img src={m.rasm} alt={m.masul} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                                  <User size={16} className="text-blue-500" />
                                </div>
                              )}
                              <span className="font-medium text-gray-700 text-sm">{m.masul}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200">
                            <p className="text-sm text-gray-600 max-w-xs truncate" title={m.izoh || undefined}>
                              {m.izoh || <span className="text-gray-400 italic">—</span>}
                            </p>
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-sm ${styles.bg} ${styles.text}`}>
                              {holat.icon}
                              {holat.label}
                            </div>
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200 text-center">
                            <div className={`inline-flex items-center justify-center w-14 h-8 rounded-lg font-bold text-sm ${styles.bg} ${styles.text}`}>
                              {foiz}%
                            </div>
                          </td>

                          <td className="px-4 py-4 border-r border-gray-200 text-center">
                            {notDoneCount > 0 ? (
                              <button
                                onClick={() => setPopupMajmua(m)}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm transition-colors border border-red-200 hover:border-red-400"
                                title="Bajarilmagan vazifalarni ko'rish"
                              >
                                {notDoneCount}
                              </button>
                            ) : (
                              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-600 font-bold text-sm border border-green-200">
                                ✓
                              </span>
                            )}
                          </td>

                          <td className={`px-4 py-4 text-center ${admin ? "border-r border-gray-200" : ""}`}>
                            <span className="text-sm font-bold text-gray-700">{jami}</span>
                          </td>

                          {admin && (
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleEdit(m)}
                                  className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                                  title="Tahrirlash"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteId(m.id)}
                                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                                  title="O'chirish"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-5 text-xs text-gray-500">
              <span className="font-semibold">Rang belgisi:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-green-500 inline-block"></span>
                <span>70–100% — Ijobiy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-yellow-400 inline-block"></span>
                <span>50–70% — Qoniqarli</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-red-500 inline-block"></span>
                <span>0–50% — Salbiy</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 mt-auto">
        <p className="text-center text-xs text-gray-400">
          created by{" "}
          <button
            onClick={() => setLoginOpen(true)}
            className="text-gray-400 hover:text-[#1e3a5f] font-medium transition-colors focus:outline-none"
          >
            @Msrfteam
          </button>
        </p>
      </footer>

      {/* Modals */}
      <AdminLogin
        open={loginOpen}
        onSuccess={() => { setAdmin(true); setLoginOpen(false); }}
        onClose={() => setLoginOpen(false)}
      />

      <AdminSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {admin && (
        <MajmuaModal
          open={modalOpen}
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}

      <BajarilmaganPopup
        open={!!popupMajmua}
        majmua={popupMajmua}
        isAdmin={admin}
        onClose={() => setPopupMajmua(null)}
        onUpdate={handlePopupUpdate}
      />

      {/* Delete confirm */}
      {deleteId && admin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">O'chirishni tasdiqlang</h3>
            <p className="text-gray-600 text-sm mb-6">Bu majmua va uning barcha vazifalari o'chiriladi.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
