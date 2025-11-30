'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, FileText, Download } from "lucide-react";

export default function EventDocs() {
  const router = useRouter();
  const params = useParams();
  const [docs, setDocs] = useState([]);

  // Data dummy dokumen
  const dummyDocs = [
    {
      id: 1,
      eventId: 9,
      name: "Sertifikat Juara 1 - Michael Simanjuntak",
      type: "Sertifikat",
      url: "#",
    },
    {
      id: 2,
      eventId: 9,
      name: "Sertifikat Juara 2 - Rudi Santoso",
      type: "Sertifikat",
      url: "#",
    },
    {
      id: 3,
      eventId: 9,
      name: "Surat Keterangan Resmi Kejuaraan",
      type: "Surat Keterangan",
      url: "#",
    },
    {
      id: 4,
      eventId: 2,
      name: "Sertifikat Partisipasi Regional Junior 2024",
      type: "Sertifikat",
      url: "#",
    },
  ];

  useEffect(() => {
    const filtered = dummyDocs.filter(
      (d) => d.eventId.toString() === params.id
    );
    setDocs(filtered);
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
        Sertifikat & Dokumen Kejuaraan
      </h1>

      {docs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Belum ada dokumen untuk event ini.
        </p>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-md text-sm transition"
              >
                <Download className="w-4 h-4" /> Unduh
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
