import { useState, useRef, useEffect } from "react";
import { X, FileText, Download, Building2, Upload, Trash2, CheckCircle2, Circle, BookOpen, Edit } from "lucide-react";
import type { Majmua, Vazifa } from "../types";
import { foizHisoblash, rangAniqla, RANG_STYLES } from "../utils/foiz";
import jsPDF from "jspdf";
import BatafsliModal from "./BatafsliModal";

const MOLIYAVIY_MASULLAR = ['A.Azimov', 'S.Abdikarimov', 'N.Ismatov'];

interface Props {
  open: boolean;
  majmua: Majmua | null;
  isAdmin: boolean;
  onClose: () => void;
  onUpdate?: (m: Majmua) => void;
}

export default function BajarilmaganPopup({ open, majmua, isAdmin, onClose, onUpdate }: Props) {
  const [local, setLocal] = useState<Majmua | null>(null);
  const [editingManba, setEditingManba] = useState<string | null>(null);
  const [batafsliVazifa, setBatafsliVazifa] = useState<Vazifa | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const pdfRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (majmua) {
      setLocal({ ...majmua, vazifalar: majmua.vazifalar.map(v => ({ ...v })) });
    }
    setEditingManba(null);
  }, [majmua, open]);

  if (!open || !majmua || !local) return null;

  const isMoliyaviy = MOLIYAVIY_MASULLAR.includes(local.masul);

  const notDone = local.vazifalar.filter(v => !v.bajarildi);
  const jami = local.vazifalar.length;
  const done = local.vazifalar.filter(v => v.bajarildi).length;
  const foiz = foizHisoblash(jami, done);
  const rang = rangAniqla(foiz);
  const styles = RANG_STYLES[rang];

  function save(updated: Majmua) {
    setLocal(updated);
    onUpdate?.(updated);
  }

  function updateVazifa(id: string, changes: Partial<Vazifa>) {
    if (!local) return;
    const updated = { ...local, vazifalar: local.vazifalar.map(v => v.id === id ? { ...v, ...changes } : v) };
    save(updated);
    if (batafsliVazifa?.id === id) {
      setBatafsliVazifa(prev => prev ? { ...prev, ...changes } : null);
    }
  }

  function toggleDone(id: string) {
    if (!isAdmin) return;
    const v = local?.vazifalar.find(x => x.id === id);
    if (v) updateVazifa(id, { bajarildi: !v.bajarildi });
  }

  function handlePdfUpload(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updateVazifa(id, { pdf: ev.target?.result as string, pdfNomi: file.name });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function openPdf(pdfData: string) {
    const win = window.open();
    if (win) win.document.write(`<iframe src="${pdfData}" style="width:100%;height:100vh;border:none;"></iframe>`);
  }

  function downloadPdf(pdfData: string, name: string) {
    const a = document.createElement("a");
    a.href = pdfData;
    a.download = name || "vazifa.pdf";
    a.click();
  }

  function exportPdf() {
    if (!local) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = 22;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(30, 58, 95);
    pdf.text("Bajarilmagan vazifalar ro'yxati", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${local.nomi}  |  Mas'ul: ${local.masul}  |  ${foiz}% (${done}/${jami})  |  ${new Date().toLocaleDateString("ru-RU")}`, margin, y);
    y += 4;
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, y, W - margin, y);
    y += 7;

    notDone.forEach((v, idx) => {
      if (y > 265) { pdf.addPage(); y = 20; }
      pdf.setFillColor(254, 226, 226);
      pdf.roundedRect(margin, y, W - margin * 2, v.batafsil ? 35 : 28, 3, 3, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(239, 68, 68);
      pdf.text(String(idx + 1), margin + 4, y + 9);
      pdf.setTextColor(30, 30, 30);
      pdf.text(pdf.splitTextToSize(v.nomi, W - margin * 2 - 20), margin + 13, y + 9);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Majmua: ${local.nomi}   |   Mas'ul: ${local.masul}`, margin + 13, y + 17);
      pdf.setTextColor(v.manba ? 194 : 150, v.manba ? 65 : 150, v.manba ? 12 : 150);
      pdf.text(`Manba: ${v.manba || "Ko'rsatilmagan"}`, margin + 13, y + 23);

      if (v.batafsil) {
        pdf.setTextColor(60, 60, 60);
        const bl = pdf.splitTextToSize(`Izoh: ${v.batafsil}`, W - margin * 2 - 20);
        pdf.text(bl, margin + 13, y + 29);
      }

      const xSum = (v.xarajatlar || []).reduce((a, x) => a + x.summa, 0);
      if (isMoliyaviy && xSum > 0) {
        pdf.setTextColor(30, 100, 200);
        pdf.text(`Jami xarajat: ${xSum.toLocaleString("uz-UZ")} so'm`, margin + 13, y + (v.batafsil ? 35 : 28));
      }

      y += (v.batafsil ? 40 : 33);
    });

    pdf.save(`${local.masul}_bajarilmagan.pdf`);
  }

  const currentNotDone = local.vazifalar.filter(v => !v.bajarildi);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-800">Bajarilmagan vazifalar</h2>
                  {isAdmin && <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Admin</span>}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Building2 size={11} />{local.nomi}</span>
                  <span className="text-gray-300">·</span>
                  <span className="font-semibold text-gray-700">{local.masul}</span>
                  <span className="text-gray-300">·</span>
                  <span>{new Date().toLocaleDateString("uz-UZ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${styles.bg} ${styles.text}`}>
                  {foiz}% ({done}/{jami})
                </span>
                <button onClick={exportPdf} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors">
                  <Download size={13} />
                  PDF yuklab olish
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-5">
            <div className="space-y-3">
              {currentNotDone.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-green-600 font-semibold text-lg">Barcha vazifalar bajarilgan! 🎉</p>
                </div>
              ) : (
                currentNotDone.map((v, idx) => (
                  <TaskCard
                    key={v.id}
                    vazifa={v}
                    idx={idx}
                    majmuaNomi={local.nomi}
                    masul={local.masul}
                    isAdmin={isAdmin}
                    isMoliyaviy={isMoliyaviy}
                    editingManba={editingManba}
                    setEditingManba={setEditingManba}
                    onToggle={() => toggleDone(v.id)}
                    onManbaChange={(val) => updateVazifa(v.id, { manba: val })}
                    onPdfUpload={(e) => handlePdfUpload(v.id, e)}
                    onPdfRemove={() => updateVazifa(v.id, { pdf: null, pdfNomi: undefined })}
                    onPdfOpen={() => v.pdf && openPdf(v.pdf)}
                    onPdfDownload={() => v.pdf && downloadPdf(v.pdf, v.pdfNomi || `${v.nomi}.pdf`)}
                    onBatafsil={() => { setBatafsliVazifa(v); setIsEditing(false); }}
                    onEdit={() => { setBatafsliVazifa(v); setIsEditing(true); }}
                    pdfRef={(el) => { pdfRefs.current[v.id] = el; }}
                    triggerPdfUpload={() => pdfRefs.current[v.id]?.click()}
                  />
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          {currentNotDone.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-500 text-center">
                Jami <span className="font-bold text-red-600">{currentNotDone.length} ta</span> vazifa bajarilmagan
                · <span className="font-bold text-gray-700">{local.masul}</span>
                · <span className="text-gray-600">{local.nomi}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Batafsil modal */}
      <BatafsliModal
        open={!!batafsliVazifa}
        vazifa={batafsliVazifa}
        majmuaNomi={local.nomi}
        masul={local.masul}
        isAdmin={isAdmin}
        isEditing={isEditing}
        onUpdate={(updated) => updateVazifa(updated.id, updated)}
        onClose={() => setBatafsliVazifa(null)}
      />
    </>
  );
}

interface TaskCardProps {
  vazifa: Vazifa;
  idx: number;
  majmuaNomi: string;
  masul: string;
  isAdmin: boolean;
  isMoliyaviy: boolean;
  editingManba: string | null;
  setEditingManba: (id: string | null) => void;
  onToggle: () => void;
  onManbaChange: (val: string) => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPdfRemove: () => void;
  onPdfOpen: () => void;
  onPdfDownload: () => void;
  onBatafsil: () => void;
  onEdit: () => void;
  pdfRef: (el: HTMLInputElement | null) => void;
  triggerPdfUpload: () => void;
}

function TaskCard({
  vazifa, idx, majmuaNomi, masul, isAdmin, isMoliyaviy,
  editingManba, setEditingManba,
  onToggle, onManbaChange, onPdfUpload, onPdfRemove,
  onPdfOpen, onPdfDownload, onBatafsil, onEdit,
  pdfRef, triggerPdfUpload,
}: TaskCardProps) {
  const xarajatJami = (vazifa.xarajatlar || []).reduce((a, x) => a + x.summa, 0);

  return (
    <div className="border border-red-100 rounded-xl overflow-hidden shadow-sm">
      {/* Title row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          {isAdmin && (
            <button onClick={onToggle} title="Bajarildi deb belgilash" className="text-gray-400 hover:text-green-500 transition-colors flex-shrink-0">
              <Circle size={18} />
            </button>
          )}
          <p className="text-sm font-bold text-gray-800 truncate">{vazifa.nomi}</p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          {/* Manba badge */}
          {vazifa.manba ? (
            <span
              onClick={() => isAdmin && setEditingManba(editingManba === vazifa.id ? null : vazifa.id)}
              className={`text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 ${isAdmin ? "cursor-pointer hover:bg-orange-200" : "cursor-default"}`}
            >
              {vazifa.manba}
            </span>
          ) : isAdmin ? (
            <button
              onClick={() => setEditingManba(editingManba === vazifa.id ? null : vazifa.id)}
              className="text-xs text-gray-400 hover:text-orange-500 transition-colors border border-dashed border-gray-300 hover:border-orange-300 px-2 py-0.5 rounded-full"
            >
              + Manba
            </button>
          ) : null}

          {/* Batafsil ko'rish button */}
          <button
            onClick={onBatafsil}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <BookOpen size={12} />
            Batafsil ko'rish
          </button>
          
          {isAdmin && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Edit size={12} />
              Tahrirlash
            </button>
          )}

          {/* PDF Ko'rish */}
          {vazifa.pdf ? (
            <div className="flex items-center gap-1">
              <button onClick={onPdfOpen} className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors">
                <FileText size={12} />
                Ko'rish
              </button>
              <button onClick={onPdfDownload} className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors" title="Yuklab olish">
                <Download size={12} />
              </button>
              {isAdmin && (
                <button onClick={onPdfRemove} className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs transition-colors" title="PDF o'chirish">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ) : isAdmin ? (
            <button onClick={triggerPdfUpload} className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs font-medium transition-colors border border-orange-200">
              <Upload size={12} />
              PDF
            </button>
          ) : null}

          <input type="file" accept="application/pdf" className="hidden" ref={pdfRef} onChange={onPdfUpload} />
        </div>
      </div>

      {/* Detail grid */}
      <div className="px-4 py-3 bg-white text-xs space-y-1.5">
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-1.5">
            <span className="text-gray-400">Tartib raqami:</span>
            <span className="font-bold text-gray-700">#{idx + 1}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-gray-400">Majmua:</span>
            <span className="font-semibold text-gray-700">{majmuaNomi}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-gray-400">Mas'ul shaxs:</span>
            <span className="font-bold text-blue-700">{masul}</span>
          </div>
          {isMoliyaviy && xarajatJami > 0 && (
            <div className="flex gap-1.5">
              <span className="text-gray-400">Jami xarajat:</span>
              <span className="font-bold text-blue-700">{xarajatJami.toLocaleString("uz-UZ")} so'm</span>
            </div>
          )}
        </div>

        {/* Manba edit inline */}
        {editingManba === vazifa.id && isAdmin && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 flex-shrink-0">Manba:</span>
            <input
              autoFocus
              type="text"
              defaultValue={vazifa.manba || ""}
              onBlur={e => { onManbaChange(e.target.value); setEditingManba(null); }}
              onKeyDown={e => { if (e.key === "Enter") { onManbaChange((e.target as HTMLInputElement).value); setEditingManba(null); } if (e.key === "Escape") setEditingManba(null); }}
              className="flex-1 border border-orange-300 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              placeholder="My Gov, Telegram, ..."
            />
          </div>
        )}

        {editingManba !== vazifa.id && (
          <div className="flex gap-1.5 items-center">
            <span className="text-gray-400">Manba:</span>
            {vazifa.manba ? (
              <span onClick={() => isAdmin && setEditingManba(vazifa.id)} className={`font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded ${isAdmin ? "cursor-pointer hover:bg-orange-100" : ""}`}>
                {vazifa.manba}
              </span>
            ) : (
              <span className="text-gray-400 italic">Ko'rsatilmagan</span>
            )}
          </div>
        )}

        {vazifa.batafsil && (
          <div className="flex gap-1.5">
            <span className="text-gray-400 flex-shrink-0">Batafsil:</span>
            <span className="text-gray-600 line-clamp-2">{vazifa.batafsil}</span>
          </div>
        )}

        {vazifa.pdf && (
          <div className="flex gap-1.5">
            <span className="text-gray-400">Ilova (PDF):</span>
            <span className="font-medium text-green-600">{vazifa.pdfNomi || "Fayl yuklangan"}</span>
          </div>
        )}
      </div>

      {/* Admin: mark done */}
      {isAdmin && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Admin: vazifani boshqarish</span>
          <button onClick={onToggle} className="flex items-center gap-1.5 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-semibold transition-colors">
            <CheckCircle2 size={13} />
            Bajarildi deb belgilash
          </button>
        </div>
      )}
    </div>
  );
}
