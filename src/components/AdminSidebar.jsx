'use client'; // Menandakan bahwa ini adalah Client Component

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // Import SweetAlert2 untuk konfirmasi logout

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear(); // Hapus semua item dari localStorage
        Swal.fire('Logout Berhasil!', 'Anda telah berhasil keluar.', 'success').then(() => {
          router.push('/login'); // Arahkan ke halaman login
          window.location.href = '/login';

        });
      }
    });
  };

  return (
    <aside className="w-64 bg-sky-900 text-black flex-shrink-0 p-6 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="text-white text-3xl font-bold tracking-wider mb-8 text-center">
        OCEANETIC <span className="text-xl font-light block">Admin Panel</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link href="/admin/dashboard" className="flex items-center p-3 rounded-lg text-lg font-medium text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300 group">
              <svg className="w-6 h-6 mr-3 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/events" className="flex items-center p-3 rounded-lg text-lg font-medium text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300 group">
              <svg className="w-6 h-6 mr-3 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Manajemen Events
            </Link>
          </li>
          <li>
            <Link href="/admin/articles" className="flex items-center p-3 rounded-lg text-lg font-medium text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300 group">
              <svg className="w-6 h-6 mr-3 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2zM11 1h2m-2 2v2m0 7h.01M15 13h.01M15 17h.01M19 13h.01M19 17h.01M5 13h.01M5 17h.01"></path></svg>
              Manajemen Articles
            </Link>
          </li>
          <li>
            <Link href="/admin/registrations" className="flex items-center p-3 rounded-lg text-lg font-medium text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300 group">
              <svg className="w-6 h-6 mr-3 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              Manajemen Registrasi
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center p-3 rounded-lg text-lg font-medium text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300 group">
              <svg className="w-6 h-6 mr-3 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M12 11V9m0 4v2m-2 4h4m-4-4h4m-4-8h4m-4 8a4 4 0 11-8 0 4 4 0 018 0zM12 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
              Manajemen Users
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-md transition duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
