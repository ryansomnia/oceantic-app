'use client'; // Menandakan ini adalah Client Component karena ada interaksi form

import { useState } from 'react';
import Swal from 'sweetalert2'; // Menggunakan SweetAlert2 untuk notifikasi

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    subject: '',
    inquiry: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi sederhana
    if (!formData.name || !formData.email || !formData.subject || !formData.inquiry) {
      Swal.fire('Input Tidak Lengkap', 'Nama, Email, Subjek, dan Pesan wajib diisi.', 'warning');
      setIsSubmitting(false);
      return;
    }

    // Simulasi pengiriman data (Anda akan menggantinya dengan API endpoint Anda)
    try {
      // Contoh: Mengirim data ke API endpoint Anda
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Gagal mengirim pesan.');
      // }

      // Swal.fire('Berhasil!', 'Pesan Anda telah terkirim.', 'success');
      // console.log('Pesan terkirim:', formData);

      // Simulasi delay untuk tampilan loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      Swal.fire('Berhasil!', 'Pesan Anda telah terkirim (simulasi).', 'success');
      console.log('Pesan terkirim:', formData);

      // Reset form
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        subject: '',
        inquiry: '',
      });

    } catch (err) {
      console.error('Error saat mengirim pesan:', err);
      Swal.fire('Error', err.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-us" className="bg-white text-black py-20 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Kolom Kiri: Info Kontak & Tagline */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-light tracking-widest uppercase mb-4">Contact Us</h2>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight uppercase">
              Wujudkan Mimpimu<br />Untuk menjadi<br />Pemenang
            </h1>
          </div>
          <div className="mt-12 text-sm font-light leading-relaxed">
            <p className="mb-4">
              <span className="font-bold">PT Oceantic</span><br />
              Jalan Community Raya No. 9, Cluster Mahoni<br />
              Komplek Taman Royal 1 Poris<br />
              Tangerang, Banten 15119 Indonesia
            </p>
            <p>
              P: +62 895-3650-89206<br />
              E: business@oceanticsports.com
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Form Kontak */}
        <div className="flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-lg placeholder-gray-500"
                placeholder="Name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="email" className="sr-only">E-mail Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-lg placeholder-gray-500"
                  placeholder="E-mail Address"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-lg placeholder-gray-500"
                  placeholder="Contact Number"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="sr-only">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-lg placeholder-gray-500"
                placeholder="Subject"
              />
            </div>
            <div>
              <label htmlFor="inquiry" className="sr-only">Tell us about your inquiry</label>
              <textarea
                id="inquiry"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-lg placeholder-gray-500 resize-none"
                placeholder="Tell us about your inquiry"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black font-semibold py-3 px-8 rounded-full  transition-colors duration-300 text-lg"
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
