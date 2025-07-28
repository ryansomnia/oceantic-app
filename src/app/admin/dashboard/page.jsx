'use client'; // Menandakan bahwa ini adalah Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Untuk navigasi internal jika diperlukan

export default function AdminDashboardPage() {
  const router = useRouter();

  // State untuk autentikasi dan otorisasi
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Loading saat cek auth

  // State untuk data dashboard
  const [activeTab, setActiveTab] = useState('events'); // Default tab
  const [eventsData, setEventsData] = useState([]);
  const [articlesData, setArticlesData] = useState([]);
  const [registrationsData, setRegistrationsData] = useState([]);
  const [loadingData, setLoadingData] = useState(false); // Loading saat fetch data
  const [error, setError] = useState(null);

  // URL dasar untuk backend API Anda
  const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1'; // Ganti dengan URL backend Vercel Anda di produksi

  // Efek untuk memeriksa status autentikasi dan otorisasi
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole'); // Asumsi Anda menyimpan role di localStorage saat login

    if (token && role) {
      setAuthToken(token);
      setUserRole(role);
      setIsAuthenticated(true);
      if (role === 'admin') {
        setIsAdmin(true);
      } else {
        // Jika bukan admin, redirect ke halaman lain (misal: home atau login)
        router.push('/');
      }
    } else {
      // Jika tidak ada token, redirect ke halaman login
      router.push('/login');
    }
    setAuthLoading(false);
  }, [router]);

  // Efek untuk mengambil data berdasarkan tab aktif
  useEffect(() => {
    if (!isAdmin || authLoading) return; // Jangan fetch jika bukan admin atau masih loading auth

    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        let url = '';
        switch (activeTab) {
          case 'events':
            url = `${API_BASE_URL}/events`; // Rute GET ALL EVENTS adalah publik
            break;
          case 'articles':
            url = `${API_BASE_URL}/articles/category/all`; // Asumsi ada endpoint untuk GET ALL articles (jika tidak, perlu dibuat)
            // Untuk demo, kita bisa pakai getArticlesByCategory dengan kategori umum atau buat endpoint baru di backend
            // Jika tidak ada endpoint get all articles, Anda perlu membuat satu di backend
            // Atau Anda bisa menggunakan getArticlesByCategory dengan kategori yang ada.
            // Untuk saat ini, saya akan asumsikan ada endpoint untuk mendapatkan semua artikel
            // atau Anda bisa mengambil berdasarkan kategori dan menggabungkannya.
            // Untuk demo, saya akan buat endpoint dummy di backend untuk 'all' category.
            // ATAU, lebih baik, tambahkan rute GET /articles di routes/article.js dan controller/article.js
            url = `${API_BASE_URL}/articles`; // Asumsi ada GET /articles untuk semua artikel
            break;
          case 'registrations':
            // Endpoint untuk mendapatkan semua registrasi (jika ada, perlu dibuat di backend)
            // Untuk demo, kita bisa pakai /registrations/event/:eventId jika ada event ID default
            // ATAU, lebih baik, tambahkan rute GET /registrations di routes/registration.js dan controller/registration.js
            url = `${API_BASE_URL}/registrations/event/1`; // Contoh: ambil semua registrasi event ID 1 (perlu endpoint get all)
            // Atau, jika Anda ingin admin bisa melihat semua, Anda perlu endpoint GET /registrations
            url = `${API_BASE_URL}/registrations`; // Asumsi ada GET /registrations untuk semua registrasi
            break;
          case 'users':
            // Endpoint untuk mendapatkan semua user (perlu dibuat di backend)
            url = `${API_BASE_URL}/users`; // Asumsi ada GET /users untuk semua user
            break;
          default:
            break;
        }

        // Untuk rute yang memerlukan token (seperti GET /users, GET /registrations), tambahkan header Authorization
        const headers = {
          'Content-Type': 'application/json',
        };
        // Periksa apakah rute memerlukan otorisasi (sesuaikan dengan routes/index.js Anda)
        if (activeTab !== 'events' && activeTab !== 'articles') { // Sesuaikan jika GET /articles juga dilindungi
             if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
        }


        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`Gagal mengambil data ${activeTab}: ${response.statusText}`);
        }

        const data = await response.json();
        switch (activeTab) {
          case 'events':
            setEventsData(data);
            break;
          case 'articles':
            setArticlesData(data);
            break;
          case 'registrations':
            setRegistrationsData(data);
            break;
          case 'users':
            // Anda perlu membuat endpoint GET /oceantic/v1/users di backend
            // dan controller/user.js untuk getAllUsers
            // Untuk saat ini, ini hanya placeholder
            // setUsersData(data);
            console.warn("Endpoint GET /users belum diimplementasikan di backend.");
            setUsersData([]); // Kosongkan jika belum ada API
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Gagal memuat data: ${err.message}. Pastikan backend berjalan dan Anda memiliki izin.`);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [activeTab, isAdmin, authLoading, authToken]); // Re-fetch saat tab, auth status, atau token berubah

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent text-white">
        Memuat Dashboard Admin...
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Atau tampilkan pesan "Akses Ditolak" jika tidak redirect
  }

  // Komponen untuk menampilkan tabel data
  const DataTable = ({ data, columns, title, onEdit, onDelete, onCreate }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-dark-charcoal">{title}</h3>
        {onCreate && (
          <button
            onClick={onCreate}
            className="bg-oceanic-blue text-white px-4 py-2 rounded-md hover:bg-aqua-accent transition duration-200"
          >
            Tambah Baru
          </button>
        )}
      </div>
      {data.length === 0 && !loadingData ? (
        <p className="text-gray-600">Tidak ada data untuk ditampilkan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                {columns.map((col, index) => (
                  <th key={index} className="py-2 px-4 border-b">{col.header}</th>
                ))}
                {(onEdit || onDelete) && <th className="py-2 px-4 border-b text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b last:border-b-0">
                  {columns.map((col, index) => (
                    <td key={index} className="py-2 px-4 text-gray-800">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-blue-600 transition duration-200"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-200"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Definisi Kolom untuk setiap tabel
  const eventColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Judul', accessor: 'title' },
    { header: 'Tanggal Event', accessor: 'event_date' },
    { header: 'Lokasi', accessor: 'location' },
    { header: 'Status', accessor: 'event_status' },
  ];

  const articleColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Judul', accessor: 'title' },
    { header: 'Kategori', accessor: 'category' },
    { header: 'Gambar', accessor: 'image_url', render: (row) => row.image_url ? <img src={row.image_url} alt="Artikel" className="w-16 h-16 object-cover rounded-md" /> : 'N/A' },
    { header: 'Dibuat Oleh', accessor: 'user_id' }, // Akan lebih baik jika ini adalah nama user
  ];

  const registrationColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nama Peserta', accessor: 'full_name' },
    { header: 'Event ID', accessor: 'event_id' },
    { header: 'Status Pembayaran', accessor: 'payment_status' },
    { header: 'Tanggal Daftar', accessor: 'registration_date' },
  ];

  const userColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Username', accessor: 'username' },
    { header: 'Nama Lengkap', accessor: 'fullname' },
    { header: 'Email', accessor: 'email' },
    { header: 'Peran', accessor: 'role' },
  ];

  // Handler untuk aksi CRUD (placeholder)
  const handleCreate = (type) => {
    alert(`Membuka form untuk membuat ${type} baru.`);
    // Implementasi: Buka modal atau navigasi ke halaman form baru
  };

  const handleEdit = (type, data) => {
    alert(`Membuka form untuk mengedit ${type} dengan ID: ${data.id}`);
    // Implementasi: Buka modal dengan data yang sudah ada
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${type} dengan ID ${id}?`)) {
      return;
    }
    setLoadingData(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal menghapus ${type}.`);
      }

      alert(`${type} berhasil dihapus!`);
      // Refresh data setelah penghapusan
      setActiveTab(activeTab); // Ini akan memicu useEffect untuk fetch ulang data
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setError(`Gagal menghapus data: ${err.message}`);
    } finally {
      setLoadingData(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-dark-charcoal mb-8 text-center">
          Dashboard Admin <span className="text-oceanic-blue">OCEANTIC</span>
        </h1>

        {/* Navigasi Tab */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'events' ? 'text-oceanic-blue border-b-2 border-oceanic-blue' : 'text-gray-600 hover:text-oceanic-blue'} transition duration-200`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'articles' ? 'text-oceanic-blue border-b-2 border-oceanic-blue' : 'text-gray-600 hover:text-oceanic-blue'} transition duration-200`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'registrations' ? 'text-oceanic-blue border-b-2 border-oceanic-blue' : 'text-gray-600 hover:text-oceanic-blue'} transition duration-200`}
          >
            Registrations
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'users' ? 'text-oceanic-blue border-b-2 border-oceanic-blue' : 'text-gray-600 hover:text-oceanic-blue'} transition duration-200`}
          >
            Users
          </button>
        </div>

        {/* Area Pesan Error/Loading */}
        {loadingData && (
          <div className="text-center text-oceanic-blue text-lg mb-4">Memuat data...</div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 px-5 py-3 rounded-lg border border-red-200 mb-4" role="alert">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Konten Dashboard (Tabel Data) */}
        {activeTab === 'events' && (
          <DataTable
            title="Daftar Events"
            data={eventsData}
            columns={eventColumns}
            onCreate={() => handleCreate('events')}
            onEdit={(data) => handleEdit('events', data)}
            onDelete={(id) => handleDelete('events', id)}
          />
        )}
        {activeTab === 'articles' && (
          <DataTable
            title="Daftar Articles"
            data={articlesData}
            columns={articleColumns}
            onCreate={() => handleCreate('articles')}
            onEdit={(data) => handleEdit('articles', data)}
            onDelete={(id) => handleDelete('articles', id)}
          />
        )}
        {activeTab === 'registrations' && (
          <DataTable
            title="Daftar Registrations"
            data={registrationsData}
            columns={registrationColumns}
            onCreate={() => handleCreate('registrations')} // Mungkin tidak ada 'create' langsung di sini
            onEdit={(data) => handleEdit('registrations', data)}
            onDelete={(id) => handleDelete('registrations', id)}
          />
        )}
        {activeTab === 'users' && (
          <DataTable
            title="Daftar Users"
            data={usersData} // Menggunakan usersData (masih placeholder)
            columns={userColumns}
            onCreate={() => handleCreate('users')} // Mungkin tidak ada 'create' langsung di sini
            onEdit={(data) => handleEdit('users', data)}
            onDelete={(id) => handleDelete('users', id)}
          />
        )}
      </div>
    </div>
  );
}
