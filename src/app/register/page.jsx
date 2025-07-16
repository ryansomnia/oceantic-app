'use client'; // Menandakan bahwa ini adalah Client Component untuk interaktivitas

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image dari Next.js untuk optimasi gambar
import { useRouter } from 'next/navigation'; // Untuk navigasi setelah registrasi sukses

export default function RegisterPage() {
  const router = useRouter(); // Inisialisasi router untuk pengalihan halaman

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'peserta', // Role default untuk pengguna baru
    fullname: '',
    gender: '',
    nohp: '',
    email: '',
  });

  // State untuk pesan notifikasi (sukses/error)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // State untuk mengelola status loading tombol submit (DIHAPUS KARENA TIDAK DIGUNAKAN)
  // const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setMessage(''); // Reset pesan sukses
    setError(''); // Reset pesan error
    // setIsLoading(true); // Aktifkan status loading (DIHAPUS)

    // Validasi sederhana pada sisi klien
    if (!formData.username || !formData.password || !formData.fullname || !formData.email || !formData.gender || !formData.nohp) {
      setError('Semua kolom wajib diisi!');
      // setIsLoading(false); // Nonaktifkan loading (DIHAPUS)
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter.');
      // setIsLoading(false); // Nonaktifkan loading (DIHAPUS)
      return;
    }

    // Simulasi pengiriman data ke API backend
    try {
      // Ganti URL ini dengan endpoint API registrasi Anda yang sebenarnya
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Registrasi Berhasil! Anda akan diarahkan ke halaman login...');
        console.log('Registration successful:', data);
        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registrasi Gagal. Coba lagi.');
        console.error('Registration failed:', errorData);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan atau server. Coba lagi nanti.');
      console.error('Network or server error:', err);
    } finally {
      // setIsLoading(false); // Pastikan loading dinonaktifkan setelah proses selesai (DIHAPUS)
    }
  };

  return (
    // Container utama halaman dengan latar belakang gradient elegan
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-aqua-accent flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container untuk layout dua kolom (gambar + form) */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Kolom Kiri: Gambar */}
        <div className="md:w-1/2 relative h-64 md:h-auto"> {/* h-64 untuk mobile, md:h-auto untuk desktop */}
          <Image
            src="/images/swim.jpg" // Ganti dengan path gambar registrasi Anda
            alt="Register for OCEANETIC Events"
            layout="fill" // Gambar akan mengisi div parent
            objectFit="cover" // Gambar akan menutupi area div, mungkin terpotong
            className="rounded-t-2xl md:rounded-l-2xl md:rounded-t-none" // Sudut membulat sesuai layout
          />
        </div>

        {/* Kolom Kanan: Form Registrasi */}
        <div className="md:w-1/2 p-8 sm:p-10 space-y-7 flex flex-col justify-center"> {/* Added flex-col justify-center to vertically center content */}
          <div>
            {/* Judul form */}
            <h2 className="mt-2 text-center text-4xl font-extrabold text-dark-charcoal">
              Daftar Akun <span className="text-oceanic-blue">OCEANETIC</span>
            </h2>
            {/* Link ke halaman login */}
           
          </div>

          {/* Form registrasi */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Area pesan sukses */}
            {message && (
              <div className="bg-green-50 text-green-700 px-5 py-3 rounded-lg border border-green-200" role="alert">
                <p className="font-medium text-sm">{message}</p>
              </div>
            )}
            {/* Area pesan error */}
            {error && (
              <div className="bg-red-50 text-red-700 px-5 py-3 rounded-lg border border-red-200" role="alert">
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Grid untuk input form dengan jarak antar kolom */}
            <div className="grid grid-cols-1 gap-4">
              {/* Input Username */}
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {/* Input Password */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {/* Input Nama Lengkap */}
              <input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Nama Lengkap"
                value={formData.fullname}
                onChange={handleChange}
              />
              {/* Input Alamat Email */}
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Alamat Email"
                value={formData.email}
                onChange={handleChange}
              />
              {/* Input Nomor Telepon */}
              <input
                id="nohp"
                name="nohp"
                type="tel"
                autoComplete="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Nomor Telepon"
                value={formData.nohp}
                onChange={handleChange}
              />
              {/* Dropdown Jenis Kelamin */}
              <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                  value={formData.gender}
                  onChange={handleChange}
              >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <p className="mt-4 text-center text-base text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-aqua-accent hover:text-oceanic-blue transition duration-200">
                Masuk di sini
              </Link>
            </p>

            {/* Tombol Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-accent transition duration-300 transform hover:scale-105"
                // disabled={isLoading} // Tombol tidak dinonaktifkan saat loading (DIHAPUS)
              >
                {/* {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'} // Teks tombol tidak berubah saat loading (DIHAPUS) */}
                Daftar Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
