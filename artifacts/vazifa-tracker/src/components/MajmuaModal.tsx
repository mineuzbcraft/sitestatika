import { useState, useRef, useEffect } from "react";
import type { Majmua, Vazifa } from "../types";
import { X, Plus, Trash2, Upload, ImagePlus, FileText, Download } from "lucide-react";

interface Props {
  open: boolean;
  initial?: Majmua | null;
  onSave: (m: Majmua) => void;
  onClose: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function MajmuaModal({ open, initial, onSave, onClose }: Props) {
  const [nomi, setNomi] = useState("");
  const [masul, setMasul] = useState("");
  const [izoh, setIzoh] = useState("");
  const [rasm, setRasm] = useState<string | null>(null);
  const [vazifalar, setVazifalar] = useState<Vazifa[]>([]);
  const [yangiVazifa, setYangiVazifa] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (initial) {
      setNomi(initial.nomi);
      setMasul(initial.masul);
      setIzoh(initial.izoh);
      setRasm(initial.rasm);
      setVazifalar(initial.vazifalar.map(v => ({ ...v })));
    } else {
      setNomi("");
      setMasul("");
      setIzoh("");
      setRasm(null);
      setVazifalar([]);
    }
    setYangiVazifa("");
  }, [initial, open]);

  if (!open) return null;

  function readImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRasm(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRasm(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readImageFile(file);
  }

  function addVazifa() {
    if (!yangiVazifa.trim()) return;
    setVazifalar(prev => [...prev, { id: uid(), nomi: yangiVazifa.trim(), bajarildi: false }]);
    setYangiVazifa("");
  }

  function removeVazifa(id: string) {
    setVazifalar(prev => prev.filter(v => v.id !== id));
  }

  function toggleVazifa(id: string) {
    setVazifalar(prev => prev.map(v => v.id === id ? { ...v, bajarildi: !v.bajarildi } : v));
  }

  function updateManba(id: string, manba: string) {
    setVazifalar(prev => prev.map(v => v.id === id ? { ...v, manba } : v));
  }

  function handleVazifaPdf(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setVazifalar(prev => prev.map(v => v.id === id ? { ...v, pdf: result, pdfNomi: file.name } : v));
    };
    reader.readAsDataURL(file);
  }

  function removePdf(id: string) {
    setVazifalar(prev => prev.map(v => v.id === id ? { ...v, pdf: null, pdfNomi: undefined } : v));
    if (pdfRefs.current[id]) pdfRefs.current[id]!.value = "";
  }

  function handleSave() {
    if (!nomi.trim() || !masul.trim()) return;
    onSave({
      id: initial?.id ?? uid(),
      nomi: nomi.trim(),
      masul: masul.trim(),
      izoh: izoh.trim(),
      rasm,
      vazifalar,
      createdAt: initial?.createdAt ?? Date.now(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            {initial ? "Tahrirlash" : "Yangi majmua qo'shish"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Majmua nomi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Majmua nomi *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nomi}
              onChange={e => setNomi(e.target.value)}
              placeholder="Majmua nomini kiriting..."
            />
          </div>

          {/* Mas'ul */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mas'ul shaxs *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={masul}
              onChange={e => setMasul(e.target.value)}
              placeholder="F.I.O..."
            />
          </div>

          {/* Rasm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rasm</label>
            {rasm ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={rasm} alt="Rasm" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow" />
                  <button
                    onClick={() => setRasm(null)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow"
                  >
                    <X size={12} />
                  </button>
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors flex items-center gap-2"
                >
                  <Upload size={14} />
                  Rasmni almashtirish
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none
                  ${dragging
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <ImagePlus size={28} className={dragging ? "text-blue-500" : "text-gray-400"} />
                <p className="text-sm font-medium text-gray-600">
                  {dragging ? "Qo'yib yuboring..." : "Rasmni bu yerga tashlang"}
                </p>
                <p className="text-xs text-gray-400">yoki bosib faylni tanlang</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleRasm} />
          </div>

          {/* Izoh */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Izoh</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              value={izoh}
              onChange={e => setIzoh(e.target.value)}
              placeholder="Bajarilgan ishlar haqida izoh..."
            />
          </div>

          {/* Vazifalar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vazifalar ({vazifalar.filter(v => v.bajarildi).length}/{vazifalar.length})
            </label>
            <div className="space-y-2 mb-3">
              {vazifalar.map((v, idx) => (
                <div key={v.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  {/* Top row: checkbox + name + delete */}
                  <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                    <span className="text-xs text-gray-400 font-bold w-5 text-center">{idx + 1}</span>
                    <input
                      type="checkbox"
                      checked={v.bajarildi}
                      onChange={() => toggleVazifa(v.id)}
                      className="w-4 h-4 rounded accent-green-600 cursor-pointer flex-shrink-0"
                    />
                    <span className={`flex-1 text-sm font-medium ${v.bajarildi ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {v.nomi}
                    </span>
                    <button onClick={() => removeVazifa(v.id)} className="text-red-400 hover:text-red-600 transition-colors p-0.5">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {/* Bottom row: manba + pdf */}
                  <div className="flex items-center gap-2 px-3 pb-2.5">
                    <div className="w-5 flex-shrink-0" />
                    <div className="w-4 flex-shrink-0" />
                    <input
                      type="text"
                      value={v.manba || ""}
                      onChange={e => updateManba(v.id, e.target.value)}
                      placeholder="Manba (My.gov, ...)"
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    {v.pdf ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium truncate max-w-[80px]" title={v.pdfNomi}>
                          {v.pdfNomi || "PDF"}
                        </span>
                        <button
                          onClick={() => removePdf(v.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => pdfRefs.current[v.id]?.click()}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors font-medium border border-orange-200"
                      >
                        <FileText size={11} />
                        PDF
                      </button>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={el => { pdfRefs.current[v.id] = el; }}
                      onChange={e => handleVazifaPdf(v.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add new task */}
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={yangiVazifa}
                onChange={e => setYangiVazifa(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addVazifa()}
                placeholder="Yangi vazifa qo'shish..."
              />
              <button
                onClick={addVazifa}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            disabled={!nomi.trim() || !masul.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
