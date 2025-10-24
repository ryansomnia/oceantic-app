'use client';

import { useState, useEffect } from 'react';
import { 
  UserCircle2, Mail, Phone, Activity, 
  Edit, Save, XCircle, Loader2, CheckCircle2 
} from 'lucide-react';

export default function MyProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    fullname: '',
    email: '',
    nohp: '',
    gender: '',
    oldPassword: '',
    newPassword: ''
  });

  const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      const idUser = localStorage.getItem('userId');

      if (!token || !idUser) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: idUser })
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setFormData({
            id: data.id,
            username: data.username,
            fullname: data.fullname,
            email: data.email,
            nohp: data.nohp,
            gender: data.gender,
            oldPassword: '',
            newPassword: ''
          });
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Gagal memuat profil pengguna.');
          localStorage.clear();
          window.location.href = '/login';
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan atau server saat memuat profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData.user);
        setMessage('Profil berhasil diperbarui!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan atau server saat memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  const getFormInputClasses = (isEditingMode) =>
    `w-full px-4 py-3 border rounded-lg transition-colors duration-200 ${
      isEditingMode
        ? 'bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue'
        : 'bg-gray-100 text-gray-800 border-gray-200 cursor-not-allowed'
    }`;

  const getLabelClasses = `flex items-center text-sm font-medium text-gray-700 mb-1`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent text-white">
        <Loader2 className="h-12 w-12 animate-spin mr-3" />
        <p className="text-xl font-semibold">Memuat Profil Anda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent p-4 sm:p-8 md:p-12 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">My Profile</h1>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl border border-green-200 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-5 py-3 rounded-xl border border-red-200 mb-4 flex items-center space-x-2">
            <XCircle className="h-5 w-5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className={getLabelClasses}>
                <UserCircle2 className="h-5 w-5 mr-2" /> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                readOnly
                className={getFormInputClasses(false)}
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className={getLabelClasses}>Nama Lengkap</label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={getFormInputClasses(isEditing)}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={getLabelClasses}><Mail className="h-5 w-5 mr-2" />Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={getFormInputClasses(isEditing)}
              />
            </div>

            {/* No HP */}
            <div>
              <label htmlFor="nohp" className={getLabelClasses}><Phone className="h-5 w-5 mr-2" />Nomor HP</label>
              <input
                id="nohp"
                name="nohp"
                type="text"
                value={formData.nohp}
                onChange={handleChange}
                readOnly={!isEditing}
                required
                className={getFormInputClasses(isEditing)}
              />
            </div>

            {/* Gender */}
         

            {/* Password lama */}
            {isEditing && (
              <div>
                <label htmlFor="oldPassword" className={getLabelClasses}>Password Lama</label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={getFormInputClasses(isEditing)}
                />
              </div>
            )}

            {/* Password baru */}
            {isEditing && (
              <div>
                <label htmlFor="newPassword" className={getLabelClasses}>Password Baru</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={getFormInputClasses(isEditing)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...userData,
                      oldPassword: '',
                      newPassword: ''
                    });
                    setError(null);
                    setMessage(null);
                  }}
                  className="flex items-center px-6 py-3 rounded-full text-lg font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 rounded-full text-lg font-semibold text-white bg-sky-500 hover:bg-aqua-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oceanic-blue"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center px-6 py-3 rounded-full text-lg font-semibold text-white bg-sky-300 hover:bg-sky-600 transition-colors duration-300"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Profil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
