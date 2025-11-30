'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";

export default function EventResults() {
  const router = useRouter();
  const params = useParams();

  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const res = await fetch(
          `http://localhost:3025/oceantic/v1/eventPdf/${params.id}`
        );

        const json = await res.json();
        if (json.code === 200 && json.data.length > 0) {
          setPdfFile(json.data[0]); // langsung ambil file pertama
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [params.id]);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 font-sans">

      {/* Tombol kembali */}
      <button
        onClick={() => router.push(`/event/${params.id}`)}
        className="flex items-center text-sky-600 hover:text-sky-800 mb-6 transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Detail Event
      </button>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Dokumen Hasil Perlombaan
      </h1>

      {loading && (
        <p className="text-gray-500">Memuat dokumen...</p>
      )}

      {!loading && !pdfFile && (
        <p className="text-gray-500 text-center mt-10">
          Belum ada file PDF untuk event ini.
        </p>
      )}

      {/* PDF langsung ditampilkan */}
      {pdfFile && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            {pdfFile.title}
          </h2>

          <embed
            src={`http://localhost:3025/uploads/documents/${pdfFile.file_name}`}
            type="application/pdf"
            className="w-full h-[750px] border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
