import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Save, XCircle, FileText, TrendingUp } from "lucide-react";
import type { Vazifa, Xarajat } from "../types";

const MOLIYAVIY_MASULLAR = ['A.Azimov', 'S.Abdikarimov', 'N.Ismatov'];

interface Props {
  open: boolean;
  vazifa: Vazifa | null;
  majmuaNomi: string;
  masul: string;
  isAdmin: boolean;
  isEditing: boolean;
  onUpdate: (v: Vazifa) => void;
  onClose: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const today = () => new Date().toISOString().slice(0, 10);

interface EditRow {
  id: string;
  sana: string;
  summa: string;
  izoh: string;
}

export default function BatafsliModal({ open, vazifa, majmuaNomi, masul, isAdmin, isEditing, onUpdate, onClose }: Props) {
  const [nomi, setNomi] = useState("");
  const [manba, setManba] = useState("");
  const [batafsil, setBatafsil] = useState("");
  const [xarajatlar, setXarajatlar] = useState<Xarajat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<EditRow>({ id: "", sana: "", summa: "", izoh: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newRow, setNewRow] = useState<EditRow>({ id: "", sana: today(), summa: "", izoh: "" });

  const isMoliyaviy = MOLIYAVIY_MASULLAR.includes(masul);

  useEffect(() => {
    if (vazifa) {
      setNomi(vazifa.nomi);
      setManba(vazifa.manba || "");
      setBatafsil(vazifa.batafsil || "");
      setXarajatlar(vazifa.xarajatlar || []);
      setEditingId(null);
      setAddingNew(false);
    } else {
      setNomi("");
      setManba("");
      setBatafsil("");
      setXarajatlar([]);
      setEditingId(null);
      setAddingNew(false);
    }
  }, [vazifa]);

  if (!open || !vazifa) return null;

  function save(updated: Partial<Vazifa>) {
    if (!vazifa) return;
    onUpdate({ ...vazifa, nomi, manba, batafsil, xarajatlar, ...updated });
  }

  function saveInfo() {
    save({ nomi, manba, batafsil, xarajatlar });
    onClose();
  }

  function startEdit(x: Xarajat) {
    setEditingId(x.id);
    setEditRow({ id: x.id, sana: x.sana, summa: String(x.summa), izoh: x.izoh });
    setAddingNew(false);
  }

  function saveEdit() {
    if (!editRow.summa) return;
    const updated = xarajatlar.map(x =>
      x.id === editingId
        ? { id: x.id, sana: editRow.sana, summa: Number(editRow.summa), izoh: editRow.izoh }
        : x
    );
    setXarajatlar(updated);
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function deleteRow(id: string) {
    const updated = xarajatlar.filter(x => x.id !== id);
    setXarajatlar(updated);
  }

  function startAdd() {
    setAddingNew(true);
    setNewRow({ id: uid(), sana: today(), summa: "", izoh: "" });
    setEditingId(null);
  }

  function saveNew() {
    if (!newRow.summa) return;
    const entry: Xarajat = { id: newRow.id, sana: newRow.sana, summa: Number(newRow.summa), izoh: newRow.izoh };
    const updated = [...xarajatlar, entry];
    setXarajatlar(updated);
    setAddingNew(false);
    setNewRow({ id: uid(), sana: today(), summa: "", izoh: "" });
  }

  function cancelAdd() {
    setAddingNew(false);
  }

  const totalSumma = xarajatlar.reduce((a, x) => a + x.summa, 0);

  function formatSum(n: number) {
    return n.toLocaleString("uz-UZ") + " so'm";
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#1e3a5f] text-white rounded-t-2xl px-6 py-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <FileText size={16} className="text-blue-300 flex-shrink-0" />
              <p className="text-xs text-blue-300">{isEditing ? "Vazifani tahrirlash" : "Batafsil ma'lumot"}</p>
            </div>
            {isEditing && isAdmin ? (
              <input
                value={nomi}
                onChange={e => setNomi(e.target.value)}
                className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-bold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="mt-1 text-base font-bold">{nomi}</p>
            )}
            <p className="text-xs text-blue-300 mt-1">{majmuaNomi} · {masul}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
            <X size={18} className="text-blue-200" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Basic info section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Asosiy ma'lumot</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Manba</label>
                {isEditing && isAdmin ? (
                  <input
                    value={manba}
                    onChange={e => setManba(e.target.value)}
                    placeholder="My.gov, Qaror, ..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="font-semibold text-orange-600">{manba || <span className="text-gray-400 italic text-xs">Ko'rsatilmagan</span>}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Holat</label>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${vazifa.bajarildi ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {vazifa.bajarildi ? "✓ Bajarildi" : "⚠ Bajarilmagan"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Batafsil izoh</label>
              {isEditing && isAdmin ? (
                <textarea
                  value={batafsil}
                  onChange={e => setBatafsil(e.target.value)}
                  rows={3}
                  placeholder="Vazifa bo'yicha batafsil ma'lumot, natijalari, qo'shimcha izohlar..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200 min-h-[60px]">
                  {batafsil || <span className="text-gray-400 italic">Izoh qo'shilmagan</span>}
                </p>
              )}
            </div>
          </div>

          {/* Xarajatlar tarixi (conditional) */}
          {isMoliyaviy && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <p className="text-sm font-bold text-gray-800">Xarajatlar tarixi</p>
                  {xarajatlar.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      {xarajatlar.length} ta
                    </span>
                  )}
                </div>
                {isEditing && isAdmin && !addingNew && (
                  <button
                    onClick={startAdd}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus size={13} />
                    Yangi xarajat
                  </button>
                )}
              </div>

              {(xarajatlar.length === 0 && !addingNew) ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <TrendingUp size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Hali xarajat qo'shilmagan</p>
                  {isEditing && isAdmin && (
                    <button onClick={startAdd} className="mt-3 text-blue-600 text-xs underline hover:text-blue-800">
                      Birinchi xarajatni qo'shish
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="px-3 py-2.5 text-left text-xs font-bold w-8">#</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold w-28">Sana</th>
                        <th className="px-3 py-2.5 text-right text-xs font-bold w-32">Summa (so'm)</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold">Izoh</th>
                        {isEditing && isAdmin && <th className="px-3 py-2.5 text-center text-xs font-bold w-20">Amal</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {xarajatlar.map((x, idx) => (
                        editingId === x.id ? (
                          <tr key={x.id} className="bg-blue-50 border-t border-gray-200">
                            <td className="px-3 py-2 text-xs text-gray-500">{idx + 1}</td>
                            <td className="px-3 py-2">
                              <input
                                type="date"
                                value={editRow.sana}
                                onChange={e => setEditRow(r => ({ ...r, sana: e.target.value }))}
                                className="w-full border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={editRow.summa}
                                onChange={e => setEditRow(r => ({ ...r, summa: e.target.value }))}
                                placeholder="0"
                                className="w-full border border-blue-300 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={editRow.izoh}
                                onChange={e => setEditRow(r => ({ ...r, izoh: e.target.value }))}
                                placeholder="Izoh..."
                                className="w-full border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={saveEdit} className="p-1 bg-green-100 hover:bg-green-200 text-green-700 rounded" title="Saqlash">
                                  <Save size={13} />
                                </button>
                                <button onClick={cancelEdit} className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded" title="Bekor">
                                  <XCircle size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={x.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2.5 text-xs text-gray-500">{idx + 1}</td>
                            <td className="px-3 py-2.5 text-xs text-gray-600">{x.sana}</td>
                            <td className="px-3 py-2.5 text-xs text-right font-semibold text-gray-800">
                              {x.summa.toLocaleString("uz-UZ")}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-gray-700">{x.izoh || <span className="text-gray-400 italic">—</span>}</td>
                            {isEditing && isAdmin && (
                              <td className="px-3 py-2.5">
                                <div className="flex items-center justify-center gap-1">
                                  <button onClick={() => startEdit(x)} className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => deleteRow(x.id)} className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        )
                      ))}

                      {/* Add new row */}
                      {addingNew && (
                        <tr className="border-t border-gray-200 bg-green-50">
                          <td className="px-3 py-2 text-xs text-gray-400">—</td>
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={newRow.sana}
                              onChange={e => setNewRow(r => ({ ...r, sana: e.target.value }))}
                              className="w-full border border-green-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={newRow.summa}
                              onChange={e => setNewRow(r => ({ ...r, summa: e.target.value }))}
                              placeholder="0"
                              autoFocus
                              className="w-full border border-green-300 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={newRow.izoh}
                              onChange={e => setNewRow(r => ({ ...r, izoh: e.target.value }))}
                              placeholder="Izoh (masalan: transport, ta'minat...)"
                              className="w-full border border-green-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={saveNew} disabled={!newRow.summa} className="p-1 bg-green-200 hover:bg-green-300 text-green-700 rounded disabled:opacity-40">
                                <Save size={13} />
                              </button>
                              <button onClick={cancelAdd} className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded">
                                <XCircle size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* Total row */}
                    {xarajatlar.length > 0 && (
                      <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-200">
                          <td colSpan={isEditing && isAdmin ? 2 : 2} className="px-3 py-2.5 text-xs font-bold text-blue-800">
                            Jami xarajat
                          </td>
                          <td className="px-3 py-2.5 text-sm font-bold text-blue-800 text-right">
                            {totalSumma.toLocaleString("uz-UZ")}
                          </td>
                          <td colSpan={isEditing && isAdmin ? 2 : 1} className="px-3 py-2.5 text-xs text-blue-600">
                            {formatSum(totalSumma)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {isEditing && isAdmin && (
            <button
              onClick={saveInfo}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Saqlash
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
          >
            {isEditing && isAdmin ? "Bekor qilish" : "Yopish"}
          </button>
        </div>
      </div>
    </div>
  );
}
