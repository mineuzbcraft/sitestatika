import { X, FileDown } from "lucide-react";
import type { Majmua } from "../types";
import { foizHisoblash, rangAniqla } from "../utils/foiz";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface Props {
  open: boolean;
  data: Majmua[];
  onClose: () => void;
}

const RANG_PDF: Record<string, { bg: string; text: string }> = {
  yashil: { bg: "#22c55e", text: "#fff" },
  sariq: { bg: "#facc15", text: "#000" },
  qizil: { bg: "#ef4444", text: "#fff" },
};

export default function PdfPreview({ open, data, onClose }: Props) {
  const tableRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const bajarilmaganlar = data.filter(m => {
    const foiz = foizHisoblash(m.vazifalar.length, m.vazifalar.filter(v => v.bajarildi).length);
    return foiz < 100;
  });

  async function exportPdf() {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("vazifalar_hisoboti.pdf");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">PDF Hisobot - Bajarilmagan vazifalar</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={exportPdf}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <FileDown size={16} />
              PDF yuklab olish
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1 p-6">
          <div ref={tableRef} className="bg-white p-6">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Bajarilmagan vazifalar ro'yxati
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Sana: {new Date().toLocaleDateString("uz-UZ")}
            </p>

            {bajarilmaganlar.length === 0 ? (
              <p className="text-center text-green-600 font-semibold text-lg py-8">
                Barcha vazifalar bajarilgan!
              </p>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#1e3a5f", color: "#fff" }}>
                    <th className="border border-gray-400 px-3 py-3 text-center w-10">T/r</th>
                    <th className="border border-gray-400 px-3 py-3 text-left">Majmua nomi</th>
                    <th className="border border-gray-400 px-3 py-3 text-left">Mas'ul</th>
                    <th className="border border-gray-400 px-3 py-3 text-left">Bajarilmagan vazifalar</th>
                    <th className="border border-gray-400 px-3 py-3 text-center">Jami/Bajarildi</th>
                    <th className="border border-gray-400 px-3 py-3 text-center">Foiz</th>
                  </tr>
                </thead>
                <tbody>
                  {bajarilmaganlar.map((m, i) => {
                    const jami = m.vazifalar.length;
                    const done = m.vazifalar.filter(v => v.bajarildi).length;
                    const foiz = foizHisoblash(jami, done);
                    const rang = rangAniqla(foiz);
                    const colors = RANG_PDF[rang];
                    const notDone = m.vazifalar.filter(v => !v.bajarildi);

                    return (
                      <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 px-3 py-3 text-center font-semibold">{i + 1}</td>
                        <td className="border border-gray-300 px-3 py-3 font-semibold text-gray-800">{m.nomi}</td>
                        <td className="border border-gray-300 px-3 py-3 text-gray-700">{m.masul}</td>
                        <td className="border border-gray-300 px-3 py-3">
                          {notDone.length === 0 ? (
                            <span className="text-green-600 text-xs">Hammasi bajarildi</span>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {notDone.map(v => (
                                <li key={v.id} className="text-red-600 text-xs">{v.nomi}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="border border-gray-300 px-3 py-3 text-center text-gray-700 font-semibold">
                          {jami}/{done}
                        </td>
                        <td
                          className="border border-gray-300 px-3 py-3 text-center font-bold text-base"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {foiz}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
