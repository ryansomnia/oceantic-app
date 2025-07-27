'use client'; // Menandakan ini adalah Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyProfilePage() {
  const router = useRouter();

  // State untuk data profil user
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Pesan sukses setelah update
  const [isEditing, setIsEditing] = useState(false); // Mode edit atau view

  // State untuk form data saat mengedit
  const [formData, setFormData] = useState({
    username: '', // Ditambahkan ke formData
    fullname: '',
    email: '',
    nohp: '',
    gender: '',
    // role biasanya tidak diizinkan diubah langsung oleh user
  });

  // URL dasar untuk backend API Anda
  const API_BASE_URL = 'http://localhost:3025/oceantic/v1'; // Ganti dengan URL backend Vercel Anda di produksi

  // Efek untuk memeriksa autentikasi dan mengambil data profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      const idUser = localStorage.getItem('userId');

console.log('====================================');
console.log(idUser);
console.log('====================================');
      if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, { // <-- Endpoint baru yang perlu Anda buat di backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({id:idUser})
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Isi formData dengan data yang diambil untuk mode edit
          setFormData({
            username: data.username, // Menggunakan username dari data
            fullname: data.fullname,
            email: data.email,
            nohp: data.nohp,
            gender: data.gender,
          });
        } else {
          // Jika token tidak valid atau ada error lain dari backend
          const errorData = await response.json();
          setError(errorData.message || 'Gagal memuat profil pengguna.');
          // Mungkin token kadaluarsa, arahkan kembali ke login
          localStorage.clear();
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Terjadi kesalahan jaringan atau server saat memuat profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handler perubahan input form saat mode edit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler submit form untuk menyimpan perubahan profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, { // <-- Endpoint PUT baru di backend
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData.user); // Asumsi backend merespons dengan user data yang diperbarui
        setMessage('Profil berhasil diperbarui!');
        setIsEditing(false); // Keluar dari mode edit
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Terjadi kesalahan jaringan atau server saat memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk logout
  const handleLogout = () => {
    localStorage.clear(); // Hapus semua item dari localStorage
    router.push('/login'); // Arahkan ke halaman login
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent text-white text-xl">
        Memuat Profil Anda...
      </div>
    );
  }

  if (error && !userData) { // Tampilkan error hanya jika tidak ada data sama sekali
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8 text-white">
        <p className="text-red-300 text-lg mb-4">{error}</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-white text-oceanic-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  // Jika tidak ada user data setelah loading, mungkin ada masalah token
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8 text-white">
        <p className="text-red-300 text-lg mb-4">Anda tidak memiliki akses atau sesi telah berakhir.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-white text-oceanic-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-dark-charcoal">
            My Profile <span className="text-oceanic-blue">OCEANETIC</span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 px-5 py-3 rounded-lg border border-green-200 mb-4" role="alert">
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 px-5 py-3 rounded-lg border border-red-200 mb-4" role="alert">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username (read-only) */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={isEditing ? formData.username : userData.username} // Menggunakan formData.username saat edit
                readOnly={!isEditing} // Read-only saat tidak edit
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? 'bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
              />
            </div>

            {/* Role (read-only) */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                id="role"
                name="role"
                type="text"
                value={userData.role}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={isEditing ? formData.fullname : userData.fullname}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? 'bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={isEditing ? formData.email : userData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? 'bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
              />
            </div>

            {/* No HP */}
            <div>
              <label htmlFor="nohp" className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
              <input
                id="nohp"
                name="nohp"
                type="text"
                value={isEditing ? formData.nohp : userData.nohp}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? 'bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue' : 'bg-gray-100 text-gray-800 cursor-not-allowed'}`}
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              {isEditing ? (
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  {/* Tambahkan opsi lain jika ada di DB Anda */}
                </select>
              ) : (
                <input
                  id="gender-display"
                  name="gender-display"
                  type="text"
                  value={userData.gender}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ // Reset form data ke data awal user
                      username: userData.username, // Reset username juga
                      fullname: userData.fullname,
                      email: userData.email,
                      nohp: userData.nohp,
                      gender: userData.gender,
                    });
                    setError(null); // Clear error messages
                    setMessage(null); // Clear success messages
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-semibold text-dark-charcoal hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-oceanic-blue hover:bg-aqua-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-accent transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-aqua-accent hover:bg-oceanic-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oceanic-blue transition duration-300"
              >
                Edit Profil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
