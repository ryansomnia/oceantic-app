'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function RegisterSwimmerPage() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [availableRaces, setAvailableRaces] = useState({}); 
  const [selectedRaces, setSelectedRaces] = useState([]); 
  // tambahin di atas:
const [ageError, setAgeError] = useState('');


  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    age_group: '',
    email: '',
    phone_number: '',
    club_name: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    payment_status: 'Pending',
    parent_consent: false,
    rules_consent: false,
  });

  const [supportingDocument, setSupportingDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:3025/oceantic/v1';

  // Fetch events
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userId || userRole !== 'member') {
      router.push('/login');
      return;
    }

    setFormData(prev => ({ ...prev, user_id: userId }));

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/getAllEventsOpen`);
        const data = await res.json();
        if (data.code === 200 && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          throw new Error('Format data event tidak valid');
        }
      } catch (err) {
        Swal.fire('Error', 'Gagal memuat daftar event.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Fetch races by event
  useEffect(() => {
    if (!formData.event_id) return;

    const fetchRaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/categories/getAvailableRaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: formData.event_id }),
        });
        const data = await res.json();
        if (data.swim_styles && data.races) {
          setAvailableRaces(data.races);
          setSelectedRaces([]); // reset pilihan tiap ganti event
        } else {
          setAvailableRaces({});
        }
      } catch (err) {
        Swal.fire('Error', 'Gagal memuat kategori lomba.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [formData.event_id]);

  // Hitung umur dan tentukan age_group
  useEffect(() => {
    if (!formData.date_of_birth || Object.keys(availableRaces).length === 0) return;
  
    const event = events.find(e => e.id == formData.event_id);
    if (!event) return;
  
    const birthDate = new Date(formData.date_of_birth);
    const eventDate = new Date(event.event_date);
    let age = eventDate.getFullYear() - birthDate.getFullYear();
    const m = eventDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
      age--;
    }
  
    let matchedGroup = '';
    Object.values(availableRaces).forEach(list => {
      list.forEach(race => {
        const match = race.age_group.match(/(\d+)[^\d]+(\d+)/);
        if (match) {
          const minAge = parseInt(match[1], 10);
          const maxAge = parseInt(match[2], 10);
          if (age >= minAge && age <= maxAge) {
            matchedGroup = race.age_group;
          }
        }
      });
    });
  
    if (matchedGroup) {
      setFormData(prev => ({ ...prev, age_group: matchedGroup }));
      setAgeError('');
    } else {
      setFormData(prev => ({ ...prev, age_group: '' }));
      setAgeError(`Maaf, umur kamu (${age} tahun) belum masuk kategori lomba yang tersedia`);
    }
  }, [formData.date_of_birth, formData.event_id, availableRaces, events]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setSupportingDocument(e.target.files[0]);
  };

  const toggleRace = (raceId) => {
    setSelectedRaces(prev =>
      prev.includes(raceId) ? prev.filter(id => id !== raceId) : [...prev, raceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire('Sesi Berakhir', 'Silakan login kembali.', 'warning');
      router.push('/login');
      setIsSubmitting(false);
      return;
    }
  
    if (!formData.event_id || !formData.gender || !formData.age_group || selectedRaces.length < 2) {
      Swal.fire('Input Tidak Lengkap', ' Coba periksa kembali apakah kamu tidak memilih event, isi tanggal lahir, gender, dan minimal 2 kategori lomba.', 'warning');
      setIsSubmitting(false);
      return;
    }

    
  
    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      selectedRaces.forEach((raceId) => {
        dataToSend.append("selected_races", raceId);
      });
      dataToSend.append('supporting_document', supportingDocument);
  
      const res = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });
  
      if (res.ok) {
        const result = await res.json();
  
        const chosenRaces = [];
        Object.entries(availableRaces).forEach(([style, list]) => {
          list.forEach(race => {
            if (selectedRaces.includes(race.race_category_id)) {
              chosenRaces.push(`${style} - ${race.age_group} - ${race.gender}`);
            }
          });
        });
  
        Swal.fire({
          title: 'Registrasi Berhasil 🎉',
          html: `
            <p><b>Total Biaya:</b> Rp ${result.total_fee.toLocaleString('id-ID')}</p>
            <p><b>Gaya yang dipilih:</b></p>
            <ul style="text-align:left">
              ${chosenRaces.map(r => `<li>${r}</li>`).join('')}
            </ul>
          `,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/statusPayment');
        });
  
      } else {
        const errData = await res.json();
        Swal.fire('Error', `${errData.message} - ${errData.detail}` || 'Pendaftaran gagal.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-xl">Memuat formulir...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-6">Form Registrasi Perenang</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilih Event */}
          <div>
            <label className="block mb-2 font-medium">Pilih Event</label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Pilih Event --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({new Date(ev.event_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Informasi Peserta */}
          <h2 className="text-xl font-semibold">Informasi Peserta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nama Lengkap" className="border p-2 rounded" required />
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="border p-2 rounded" required />
            {ageError && <p className="text-red-600 text-sm mt-1">{ageError}</p>}

            <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Pilih Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="No HP" className="border p-2 rounded" required />
            <input type="text" name="club_name" value={formData.club_name} onChange={handleChange} placeholder="Klub/Individu" className="border p-2 rounded" />
          </div>

          {/* Info Age Group (otomatis terisi) */}
          {formData.age_group && (
            <p className="text-green-600 font-medium">Kelompok Umur Otomatis: {formData.age_group}</p>
          )}

          {/* Pilihan Lomba */}
          {formData.event_id && formData.gender && formData.age_group && (
            <>
              <h2 className="text-xl font-semibold mt-6">Pilih Kategori Lomba</h2>
              <div className="space-y-4">
                {Object.entries(availableRaces).map(([style, list]) => {
                  const filteredList = list.filter(
                    race => race.gender === formData.gender && race.age_group === formData.age_group
                  );

                  if (filteredList.length === 0) return null;

                  return (
                    <div key={style} className="border p-3 rounded">
                      <h3 className="font-medium mb-2">{style}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredList.map(race => (
                          <label key={race.race_category_id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedRaces.includes(race.race_category_id)}
                              onChange={() => toggleRace(race.race_category_id)}
                            />
                            <span>{race.age_group} - {race.gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Kontak Darurat */}
          <h2 className="text-xl font-semibold">Kontak Darurat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} placeholder="Nama Kontak Darurat" className="border p-2 rounded" required />
            <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} placeholder="No HP Kontak" className="border p-2 rounded" required />
          </div>

          {/* Dokumen */}
          <h2 className="text-xl font-semibold">Dokumen</h2>
          <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="border p-2 rounded w-full" required />

          {/* Persetujuan */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="parent_consent" checked={formData.parent_consent} onChange={handleChange} required />
              <span>Saya menyetujui keikutsertaan anak saya.</span>
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="rules_consent" checked={formData.rules_consent} onChange={handleChange} required />
              <span>Saya menyetujui aturan lomba.</span>
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-oceanic-blue hover:underline">Kembali ke Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
