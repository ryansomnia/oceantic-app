'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Tambah icon show/hide

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    retypePassword: '',
    role: 'member',
    fullname: '',
    gender: '',
    nohp: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 👁️ State toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validasi
    if (!formData.username || !formData.password || !formData.retypePassword || !formData.fullname || !formData.email || !formData.gender || !formData.nohp) {
      setError('Semua kolom wajib diisi!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      setError('Password dan Retype Password tidak cocok.');
      return;
    }

    try {
      const response = await fetch('https://api.oceanticsports.com/oceantic/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Registrasi Berhasil! Anda akan diarahkan ke halaman login...');
        console.log('Registration successful:', data);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registrasi Gagal. Coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan atau server. Coba lagi nanti.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-aqua-accent flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Kolom kiri */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="/images/swim.jpg"
            alt="Register for OCEANTIC Events"
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
          />
        </div>

        {/* Kolom kanan */}
        <div className="md:w-1/2 p-8 sm:p-10 space-y-7 flex flex-col justify-center">
          <h2 className="mt-2 text-center text-4xl font-extrabold text-dark-charcoal">
            Daftar Akun <span className="text-oceanic-blue">OCEANTIC</span>
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div className="bg-green-50 text-green-700 px-5 py-3 rounded-lg border border-green-200">
                <p className="font-medium text-sm">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 px-5 py-3 rounded-lg border border-red-200">
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {/* Username */}
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-oceanic-blue"
              />

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-oceanic-blue"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Retype Password */}
              <div className="relative">
                <input
                  id="retypePassword"
                  name="retypePassword"
                  type={showRetypePassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi Password"
                  value={formData.retypePassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-oceanic-blue"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                >
                  {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Nama Lengkap */}
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                placeholder="Nama Lengkap"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue"
              />

              {/* Email */}
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Alamat Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue"
              />

              {/* Nomor Telepon */}
              <input
                id="nohp"
                name="nohp"
                type="tel"
                required
                placeholder="Nomor Telepon"
                value={formData.nohp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue"
              />

              {/* Jenis Kelamin */}
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <p className="mt-4 text-center text-base text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-aqua-accent hover:text-oceanic-blue">
                Masuk di sini
              </Link>
            </p>

            <button
              type="submit"
              className="w-full py-3 px-4 text-lg font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-500 transition transform hover:scale-105"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
