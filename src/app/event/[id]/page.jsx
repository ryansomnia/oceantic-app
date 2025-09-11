"use client";

import { useRouter } from "next/navigation";

export default function EventDetail({ params }) {
  const router = useRouter();

  return (
    <div className="mt-10">
      {/* Hasil Perlombaan */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold">Hasil Perlombaan</h2>
        <p className="text-gray-500 text-sm">
          Lihat hasil lengkap dari setiap nomor perlombaan
        </p>
        <button
          onClick={() => router.push(`/event/${params.id}/results`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Lihat Hasil →
        </button>
      </div>

      {/* Sertifikat dan Surat Keterangan */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold">Sertifikat dan Surat Keterangan</h2>
        <p className="text-gray-500 text-sm">
          Unduh sertifikat untuk para pemenang dan surat keterangan resmi kejuaraan
        </p>
        <button
          onClick={() => router.push(`/event/${params.id}/docs`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Lihat Dokumen →
        </button>
      </div>
    </div>
  );
}
