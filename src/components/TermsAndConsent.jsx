"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function TermsAndConsent({ formData, handleChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-gray-50">
      {/* Tombol buka modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-600 underline text-sm"
      >
        Baca Syarat & Ketentuan
      </button>

      {/* Modal dengan transisi */}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          {/* Background */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          {/* Wrapper */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                <Dialog.Title className="text-xl font-bold mb-4 text-center">
                  Syarat dan Ketentuan
                </Dialog.Title>

                {/* Scrollable Content */}
                <div className="max-h-[400px] overflow-y-auto pr-2 text-sm text-gray-700 space-y-3">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                    Syarat dan Ketentuan
 
 
 
                      <strong>Ketentuan Penggunaan</strong> <br />
                      Dengan menggunakan situs OCR (Oceantic Competition Registration),
                       Anda dianggap telah memahami dan menyetujui seluruh syarat dan ketentuan yang berlaku.
                        Apabila tidak berkenan, harap menghentikan penggunaan situs.
                    </li>
                    <li>
                      <strong>Hak Kekayaan Intelektual</strong> <br />                  
                        Seluruh konten, merek dagang, logo,
                          dan materi dalam situs ini merupakan milik OCR (Oceantic Competition Registration) 
                          dan dilindungi oleh hukum. Dilarang memperbanyak, mengubah, 
                          atau menyebarkan tanpa izin resmi.
   </li>
                    <li>
                      <strong>Perubahan Ketentuann</strong> <br />
                    OCR (Oceantic Competition Registration)  berhak melakukan perubahan pada informasi,
                     harga, layanan, maupun syarat dan ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu.
                      Dalam hal terjadi kesalahan harga, OCR (Oceantic Competition Registration)
                       berhak menolak pesanan.
 
                    </li>
                    <li>
                      <strong>Komunikasi</strong> <br />
                     OCR (Oceantic Competition Registration) berhak menyampaikan informasi, pembaruan, maupun penawaran melalui email resmi. Pengguna dapat memilih untuk berhenti berlangganan sesuai ketentuan yang berlaku.
   </li>
                    <li>
                      <strong>Deskripsi Layanan</strong> <br />
                      OCR(Oceantic Competition Registration) berupaya menyajikan informasi layanan secara akurat.
                       Namun, perbedaan tampilan dapat terjadi karena keterbatasan perangkat pengguna.
                         </li>
                    <li>
                      <strong>Registrasi Pengguna</strong> <br />
                      Untuk mengakses layanan, pengguna wajib mendaftar dengan data yang benar dan terkini. 
                      Pengguna bertanggung jawab menjaga kerahasiaan akun serta dilarang menyalahgunakan akses 
                      tersebut.
 
                    </li>
                    <li>
                      <strong>Hukum yang Berlaku</strong> <br />
                      Seluruh ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia.
                    </li>
                    <li>
                      <strong>Kebijakan Privasi</strong> <br />
                      Data pribadi pengguna dijamin kerahasiaannya dan hanya digunakan untuk kepentingan
                       layanan OCR (Oceantic Competition Registration). 
                       Data tidak akan diperjualbelikan kepada pihak ketiga.

                    </li>
                    <li>
                      <strong>Ganti Rugi</strong> <br />
                      Pengguna menyetujui untuk membebaskan OCR (Oceantic Competition Registration) 
                      dari segala bentuk klaim, tuntutan, atau kerugian yang timbul akibat penggunaan situs.
 
      </li>
                    <li>
                      <strong>Penafian</strong> <br />
                      OCR (Oceantic Competition Registration) tidak menjamin seluruh informasi pada 
                      situs selalu mutakhir atau bebas dari kesalahan. Konten dapat berubah atau dihapus 
                      sewaktu-waktu.

                    </li>
                    <li>
                      <strong>Pertanyaan dan Masukan</strong> <br />
                      Segala bentuk pertanyaan, saran, maupun keluhan dapat disampaikan langsung kepada 
                      tim OCR (Oceantic Competition Registration) melalui saluran komunikasi resmi.

                    </li>
                    <li>
                      <strong>Faktor Alam</strong> <br />
                      Faktor alam dapat mempengaruhi berjalannya pertandingan. 
                      Apabila pertandingan tidak dapat dilanjutkan karena kondisi cuaca
                        yang tidak mendukung atau faktor lainnya dan di luar kendali dari
                         panitia, maka pertandingan dianggap selesai dan tidak ada pengembalian
                          dana dalam bentuk apapun.

                    </li>
                  </ol>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    Tutup
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
