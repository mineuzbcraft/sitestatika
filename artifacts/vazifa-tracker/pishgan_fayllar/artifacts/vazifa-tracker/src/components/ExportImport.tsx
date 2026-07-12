import { useRef, useState } from "react";
import { Upload, Download, FileJson, X, CheckCircle2, AlertCircle } from "lucide-react";
import type { Majmua } from "../types";

interface Props {
  majmualar: Majmua[];
  onImport: (updated: Majmua[]) => void;
  isAdmin: boolean;
}

interface ImportResult {
  added: number;
  updated: number;
  errors: number;
}

export default function ExportImport({ majmualar, onImport, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportData() {
    const json = JSON.stringify(majmualar, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vazifa_tracker_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function processImport(raw: string) {
    try {
      const imported = JSON.parse(raw) as Majmua[];
      if (!Array.isArray(imported)) throw new Error("Noto'g'ri format");

      let added = 0;
      let updated = 0;
      let errors = 0;

      const result = [...majmualar];

      imported.forEach(item => {
        if (!item.id || !item.nomi || !item.masul) { errors++; return; }
        const idx = result.findIndex(m => m.id === item.id);
        if (idx >= 0) {
          result[idx] = { ...result[idx], ...item };
          updated++;
        } else {
          result.push(item);
          added++;
        }
      });

      onImport(result);
      setResult({ added, updated, errors });
    } catch {
      setResult({ added: 0, updated: 0, errors: 1 });
    }
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".json")) {
      setResult({ added: 0, updated: 0, errors: 1 });
      return;
    }
    const reader = new FileReader();
    reader.onload = e => processImport(e.target?.result as string);
    reader.readAsText(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClose() {
    setOpen(false);
    setResult(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        <FileJson size={16} />
        Export / Import
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-800">Export / Import</h2>
                <p className="text-xs text-gray-500 mt-0.5">Barcha ma'lumotlar, rasmlar va vazifalar</p>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Export */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Download size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">Ma'lumotlarni yuklab olish</p>
                    <p className="text-xs text-gray-500 mt-0.5 mb-3">
                      Barcha majmualar, mas'ul shaxslar, rasmlar, vazifalar va PDF fayllar JSON formatida saqlanadi.
                    </p>
                    <button
                      onClick={exportData}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Download size={13} />
                      JSON yuklab olish ({majmualar.length} ta majmua)
                    </button>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                        <Upload size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Ma'lumotlarni yuklash (Import)</p>
                        <p className="text-xs text-gray-500 mt-0.5 mb-3">
                          Avval saqlangan JSON faylni yuklang. Mavjud shaxslar yangilanadi, yangilari qo'shiladi.
                        </p>
                        <div
                          onDragOver={e => { e.preventDefault(); setDragging(true); }}
                          onDragLeave={() => setDragging(false)}
                          onDrop={handleDrop}
                          onClick={() => fileRef.current?.click()}
                          className={`flex flex-col items-center justify-center gap-1.5 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                            dragging
                              ? "border-green-500 bg-green-100 scale-[1.01]"
                              : "border-green-300 bg-white hover:border-green-500 hover:bg-green-50"
                          }`}
                        >
                          <FileJson size={24} className={dragging ? "text-green-600" : "text-green-400"} />
                          <p className="text-xs font-semibold text-gray-600">
                            {dragging ? "Qo'yib yuboring..." : "JSON faylni bu yerga tashlang"}
                          </p>
                          <p className="text-xs text-gray-400">yoki bosib tanlang</p>
                        </div>
                        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {result && (
                    <div className={`rounded-xl p-3.5 border flex items-start gap-3 ${
                      result.errors > 0 && result.added === 0 && result.updated === 0
                        ? "bg-red-50 border-red-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}>
                      {result.errors > 0 && result.added === 0 && result.updated === 0 ? (
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        {result.added === 0 && result.updated === 0 && result.errors > 0 ? (
                          <p className="font-bold text-red-700">Xatolik: Noto'g'ri fayl formati</p>
                        ) : (
                          <>
                            <p className="font-bold text-emerald-700 mb-1">Import muvaffaqiyatli!</p>
                            {result.added > 0 && <p className="text-gray-600">✅ Yangi qo'shildi: <b>{result.added} ta</b></p>}
                            {result.updated > 0 && <p className="text-gray-600">🔄 Yangilandi: <b>{result.updated} ta</b></p>}
                            {result.errors > 0 && <p className="text-orange-600">⚠️ O'tkazib yuborildi: <b>{result.errors} ta</b></p>}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
