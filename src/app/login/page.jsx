'use client'; // Menandakan bahwa ini adalah Client Component untuk interaktivitas

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image dari Next.js untuk optimasi gambar
import { useRouter } from 'next/navigation'; // Untuk navigasi setelah login sukses

export default function LoginPage() {
  const router = useRouter(); // Inisialisasi router untuk pengalihan halaman

  // State untuk menyimpan data form login
  const [formData, setFormData] = useState({
    username: '', // Bisa juga email, tergantung backend Anda
    password: '',
  });

  // State untuk pesan notifikasi (sukses/error)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Dummy Data Login
  const DUMMY_USERNAME = 'ryansomnia';
  const DUMMY_PASSWORD = 'lzhyto2371';
  const DUMMY_FULLNAME = 'Heriyanto Sitorus';
  const DUMMY_EMAIL = 'laskarimmanuel@gmail.com';
  const DUMMY_NOHP = '087781018141';
  const DUMMY_GENDER = 'Pria';


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

    // Validasi sederhana pada sisi klien
    if (!formData.username || !formData.password) {
      setError('Username/Email dan Password wajib diisi!');
      return;
    }

    // --- LOGIKA DUMMY LOGIN ---
    if (formData.username === DUMMY_USERNAME && formData.password === DUMMY_PASSWORD) {
      // Login Berhasil (Simulasi)
      setMessage('Login Berhasil! Anda akan diarahkan ke Dashboard...');
      console.log('Dummy Login successful for:', formData.username);

      // Simpan status login dan username dummy ke localStorage (untuk Navbar)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', DUMMY_FULLNAME); // Menggunakan nama lengkap sebagai username di Navbar

      // Redirect ke halaman utama atau dashboard setelah 2 detik
      setTimeout(() => {
        router.push('/my-profile'); // Ganti dengan '/dashboard' atau rute lain yang sesuai
        // window.location.reload(); // <--- BARIS INI DIHAPUS
      }, 2000);
    } else {
      // Login Gagal (Simulasi)
      setError('Login Gagal. Username atau Password salah.');
      console.error('Dummy Login failed for:', formData.username);
    }
    // --- AKHIR LOGIKA DUMMY LOGIN ---

    // Catatan: Bagian fetch API di bawah ini telah dihapus karena menggunakan dummy login.
    // Jika Anda ingin kembali ke integrasi backend, Anda bisa mengaktifkan kembali kode fetch ini.
    /*
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Login Berhasil! Anda akan diarahkan ke Dashboard...');
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token); // Contoh: simpan token
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login Gagal. Username atau Password salah.');
        console.error('Login failed:', errorData);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan atau server. Coba lagi nanti.');
      console.error('Network or server error:', err);
    }
    */
  };

  return (
    // Container utama halaman dengan latar belakang gradient elegan
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container untuk layout dua kolom (gambar + form) */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Kolom Kiri: Gambar */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="/images/swim.jpg" // Ganti dengan path gambar login Anda
            alt="Login to OCEANETIC"
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
          />
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="md:w-1/2 p-8 sm:p-10 space-y-7 flex flex-col justify-center">
          <div>
            {/* Judul form */}
            <h2 className="mt-2 text-center text-4xl font-extrabold text-dark-charcoal">
              Sign In <span className="text-oceanic-blue">OCEANETIC</span>
            </h2>
          </div>

          {/* Form login */}
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

            {/* Grid untuk input form */}
            <div className="grid grid-cols-1 gap-4">
              {/* Input Username/Email */}
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Username atau Email"
                value={formData.username}
                onChange={handleChange}
              />
              {/* Input Password */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue sm:text-base"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* Link "Belum punya akun?" dipindahkan ke sini, di bawah input */}
            <p className="mt-4 text-center text-base text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-aqua-accent hover:text-oceanic-blue transition duration-200">
                Daftar di sini
              </Link>
            </p>

            {/* Tombol Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-oceanic-blue hover:bg-aqua-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-accent transition duration-300 transform hover:scale-105"
              >
                Masuk
              </button>
            </div>

            {/* Opsi lupa password (opsional) - dikomentari sesuai permintaan */}
            {/* <div className="text-sm text-center">
              <Link href="/forgot-password" className="font-medium text-gray-600 hover:text-oceanic-blue">
                Lupa Password?
              </Link>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
