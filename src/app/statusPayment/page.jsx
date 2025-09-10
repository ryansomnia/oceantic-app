'use client';

import React, { useState, useEffect } from 'react';
import { CircleCheck, CircleAlert, Hourglass, Upload, Loader2, ImageUp } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';
const FILE_BASE_URL = "https://api.oceanticsports.com";

const StatusPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentPhotoUrl, setPaymentPhotoUrl] = useState(null);
  const [swimStyles, setSwimStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Success':
        return {
          icon: <CircleCheck className="h-10 w-10 text-white" />,
          color: 'bg-green-500',
          title: 'Pembayaran Dikonfirmasi!',
          message: 'Bukti pembayaran Anda telah diverifikasi.'
        };
      case 'Cancelled':
        return {
          icon: <CircleAlert className="h-10 w-10 text-white" />,
          color: 'bg-red-500',
          title: 'Pembayaran Gagal',
          message: 'Pembayaran Anda gagal atau belum diverifikasi.'
        };
      case 'Pending':
      default:
        return {
          icon: <Hourglass className="h-10 w-10 text-white" />,
          color: 'bg-yellow-500',
          title: 'Menunggu Verifikasi',
          message: 'Bukti pembayaran Anda sedang ditinjau.'
        };
    }
  };

  const fetchPaymentStatus = async () => {
    if (!userId) {
      setError('ID pengguna tidak ditemukan. Silakan login kembali.');
      setIsLoading(false);
      return;
    }

    try {
      const regRes = await fetch(`${API_BASE_URL}/registrations/getRegistrationByUserId/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (regRes.status === 404) {
        setError('NO_EVENT');
        setIsLoading(false);
        return;
      }
      if (!regRes.ok) throw new Error('Gagal ambil registrasi user');

      const regData = await regRes.json();
      if (regData.code === 404) {
        setError('NO_EVENT');
        setIsLoading(false);
        return;
      }
      if (regData.code !== 200 || !regData.data) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Kamu belum mendaftar event manapun, segera daftarkan dirimu.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        setError('Tidak ada registrasi ditemukan.');
        setIsLoading(false);
        return;
      }

      const swimmerRegId = regData.data.id;

      // ===== Payment status
      const paymentRes = await fetch(`${API_BASE_URL}/getStatusPaymentById/${swimmerRegId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!paymentRes.ok) throw new Error('Gagal memuat status pembayaran.');
      const paymentData = await paymentRes.json();

      if (paymentData.detail && paymentData.detail.length > 0) {
        const payment = paymentData.detail[0];
        setPaymentDetails({
          id: payment.id,
          title: payment.title,
          fullName: payment.full_name,
          status: payment.payment_status,
          age_group_class: payment.age_group_class,

          totalFee: payment.total_fee ?? 0,
          paymentPhotoUrl: payment.payment_photo_url && payment.payment_photo_url !== 'null'
            ? (payment.payment_photo_url.startsWith('http') ? payment.payment_photo_url : `${FILE_BASE_URL}${payment.payment_photo_url}`)
            : null,
        });
        setPaymentStatus(payment.payment_status);
        setPaymentPhotoUrl(payment.payment_photo_url && payment.payment_photo_url !== 'null'
          ? (payment.payment_photo_url.startsWith('http') ? payment.payment_photo_url : `${FILE_BASE_URL}${payment.payment_photo_url}`)
          : null);
      } else {
        setError('Tidak ada data pembayaran yang ditemukan.');
      }

      // ===== Swim styles
      const swimStylesRes = await fetch(`${API_BASE_URL}/getSwimStyles/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!swimStylesRes.ok) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Tidak ada gaya renang yang ditemukan untuk akun ini.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        setSwimStyles([]);
        return;
      }

      const swimStylesData = await swimStylesRes.json();
      if (swimStylesData.code === 200 && swimStylesData.data?.length > 0) {
        setSwimStyles(swimStylesData.data);
      } else {
        Swal.fire({
          title: 'Peringatan',
          text: 'Tidak ada gaya renang yang ditemukan untuk akun ini.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        setSwimStyles([]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Terjadi kesalahan jaringan atau server saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage(`File terpilih: ${file.name}`);
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Silakan pilih file bukti pembayaran terlebih dahulu.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsUploading(true);
    setUploadMessage('Mengunggah bukti pembayaran...');

    const formData = new FormData();
    formData.append('registration_id', paymentDetails?.id);
    formData.append('payment_photo', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/uploadPayment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (response.ok) {
        Swal.fire({
          title: 'Sukses!',
          text: data.message || 'Bukti pembayaran berhasil diunggah.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          fetchPaymentStatus();
        });

        setSelectedFile(null);
        setUploadMessage('');

      } else {
        Swal.fire({
          title: 'Gagal!',
          text: data.message || 'Gagal mengunggah bukti pembayaran.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    } catch (err) {
      console.error('❌ Upload error:', err);
      Swal.fire({
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan jaringan.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const statusDisplay = getStatusDisplay(paymentStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl shadow-xl">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-xl font-semibold text-gray-600">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (error === 'NO_EVENT') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 font-sans text-gray-800">
          <p className="text-blue-600 text-xl font-bold mb-4 text-center">
            Anda belum mendaftar di Event manapun
          </p>
          <p className="text-gray-600 text-center">Silakan lakukan pendaftaran event terlebih dahulu.</p>
        </div>
      );
    }
  
    if (error === 'GENERAL_ERROR') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 font-sans text-gray-800">
          <p className="text-red-600 text-lg mb-4 text-center">
            Terjadi kesalahan jaringan atau server saat memuat data.
          </p>
        </div>
      );
    }}

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-100 flex items-center justify-center font-sans text-gray-800">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col space-y-8">
            
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full shadow-lg ${statusDisplay.color}`}>
                {statusDisplay.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{statusDisplay.title}</h1>
                <p className="text-sm text-gray-600">{statusDisplay.message}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-full">
              <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
                Detail Pembayaran
              </h2>
              {paymentDetails && (
                <div className="space-y-4 text-left">
                  <DetailItem label="Judul Event" value={paymentDetails.title} />
                  <DetailItem label="Nama Lengkap" value={paymentDetails.fullName} />
                  <DetailItem label="Kelompok Umur" value={paymentDetails.age_group_class} />

                  
                  <DetailItem label="Status Pembayaran" value={paymentDetails.status} />
                  <div className="py-4">
                    <span className="text-gray-500 font-medium block mb-2">Gaya Renang yang Dipilih</span>
                    <div className="flex flex-wrap gap-2">
                      {swimStyles.length > 0 ? (
                        swimStyles.map((style, index) => (
                          <div key={index} className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full shadow-sm text-sm">
                            {style.swim_style}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-800 font-semibold">Tidak ada gaya renang yang dipilih.</p>
                      )}
                    </div>
                  </div>
                  <DetailItem label="Biaya Admin" value={'Rp. 2.500'}/>
                  <DetailItem 
                    label="Total Biaya" 
                    value={`Rp ${(paymentDetails.totalFee || 0).toLocaleString("id-ID")}`} 
                  />
                </div>
              )}
            </div>
          </div>

          {paymentStatus !== 'Success' && (
            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
                    Unggah Bukti Pembayaran
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Silakan unggah foto atau tangkapan layar bukti transfer Anda.
                  </p>

                  {paymentPhotoUrl ? (
                    <div className="flex flex-col items-center justify-center w-full bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300 border-dashed">
                      <Hourglass className="w-12 h-12 text-yellow-500 mb-4" />
                      <p className="text-sm text-yellow-600 font-semibold text-center">
                        Bukti Pembayaran sudah diunggah. Menunggu verifikasi.
                      </p>
                      <a href={paymentPhotoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-500 hover:underline">
                        Lihat Bukti Pembayaran
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-full">
                        <label 
                          htmlFor="dropzone-file" 
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedFile ? (
                              <>
                                <CircleCheck className="h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm text-gray-600 font-semibold">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
                              </>
                            ) : (
                              <>
                                <ImageUp className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500 font-semibold">
                                  <span className="font-bold text-blue-600">Klik untuk unggah</span> 
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, JPEG (Maks. 5MB)
                                </p>
                              </>
                            )}
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".png, .jpg, .jpeg" />
                        </label>
                      </div>
                      
                      {typeof uploadMessage === 'string' && uploadMessage && (
                        <div className="mt-4 text-sm text-center">
                          <p className={uploadMessage.includes('berhasil') ? 'text-green-600' : uploadMessage.includes('gagal') ? 'text-red-600' : 'text-gray-600'}>
                            {uploadMessage}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {!paymentPhotoUrl && (
                  <button
                    onClick={handleUploadProof}
                    disabled={!selectedFile || isUploading}
                    className={`mt-6 w-full flex items-center justify-center py-3 rounded-full font-semibold transition duration-300 ${
                      selectedFile
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 mr-2" />
                    )}
                    {isUploading ? 'Mengunggah...' : 'Simpan Bukti Pembayaran'}
                  </button>
                )}

                {/* Tambahan Instruksi Pembayaran jika status Pending */}
{/* Instruksi Pembayaran */}
{paymentStatus === 'Pending' && (
  <div className="mt-8 bg-white rounded-2xl shadow-md border p-6">
    <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
      Instruksi Pembayaran
    </h2>

    {/* Dropdown Pilih Metode */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Pilih Metode Pembayaran
      </label>
      <select
        className="w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={selectedBank}
        onChange={(e) => setSelectedBank(e.target.value)}
      >
        <option value="" disabled>Pilih Metode</option>
        {/* <option value="qris">QRIS</option> */}
        {/* <option value="bri">Bank BRI</option> */}
        <option value="bca">Bank BCA</option>
        {/* <option value="mandiri">Bank Mandiri</option> */}
      </select>
    </div>

    {/* Konten sesuai pilihan */}
    {selectedBank === 'qris' && (
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Scan QRIS untuk membayar:</p>
        <div className="flex justify-center">
          <img
            src="/qris.jpeg" // ganti dengan file/endpoint QRIS beneran
            alt="QR Code Pembayaran"
            className="w-48 h-48 border rounded-xl shadow-lg"
          />
        </div>
      </div>
    )}

    {selectedBank === 'bri' && (
      <div className="bg-gray-50 rounded-xl p-5 shadow-sm border mb-3">
        <p className="text-sm text-gray-600 mb-1">Bank BRI</p>
        <p className="font-bold text-gray-800">1234567890 a.n PT Oceantic</p>
      </div>
    )}

    {selectedBank === 'bca' && (
      <div className="bg-gray-50 rounded-xl p-5 shadow-sm border mb-3">
        <p className="text-sm text-gray-600 mb-1">Bank BCA</p>
        <p className="font-bold text-gray-800">4910493430 a.n David Christianto</p>
      </div>
    )}

    {selectedBank === 'mandiri' && (
      <div className="bg-gray-50 rounded-xl p-5 shadow-sm border mb-3">
        <p className="text-sm text-gray-600 mb-1">Bank Mandiri</p>
        <p className="font-bold text-gray-800">4567891230 a.n PT Oceantic</p>
      </div>
    )}
  </div>
)}



              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b last:border-b-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

export default StatusPayment;
