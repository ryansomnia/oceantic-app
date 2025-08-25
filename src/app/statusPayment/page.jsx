'use client';

import React, { useState, useEffect } from 'react';
import { CircleCheck, CircleAlert, Hourglass, Upload, Loader2, ImageUp } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';

const StatusPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentPhotoUrl, setPaymentPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

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
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    console.log('================userId====================');
    console.log(userId);
    console.log('====================================');
  
    if (!userId) {
      setError('ID pengguna tidak ditemukan. Silakan login kembali.');
      setIsLoading(false);
      window.location.href = '/login'; 
      return;
    }
  
    try {
      // Ambil swimmer_registration.id dari user
      const regRes = await fetch(`${API_BASE_URL}/registrations/getRegistrationByUserId/${userId}`);
      if (!regRes.ok) throw new Error('Gagal ambil registrasi user');
  
      const regData = await regRes.json();
      if (regData.code !== 200 || !regData.data) {
        setError('Tidak ada registrasi ditemukan.');
        setIsLoading(false);
        return;
      }
  
      const swimmerRegId = regData.data.id;
      console.log('==================vswimmerRegId==================');
      console.log(swimmerRegId);
      console.log('====================================');
  
      // Panggil API status pembayaran berdasarkan swimmer_registration.id
      const response = await fetch(`${API_BASE_URL}/getStatusPaymentById/${swimmerRegId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.detail && data.detail.length > 0) {
          console.log('====================================');
          console.log(data);
          console.log('====================================');
          const payment = data.detail[0];
          console.log('====================================');
          console.log(payment);
          console.log('====================================');
          setPaymentDetails({
            id: payment.id,
            title: payment.title,
            fullName: payment.full_name,
            status: payment.payment_status,
            totalFee: payment.total_fee ?? 0, // ✅ kalau null/undefined -> jadi 0
            paymentPhotoUrl: payment.payment_photo_url === 'null' ? null : payment.payment_photo_url,
          });
          setPaymentStatus(payment.payment_status);
          setPaymentPhotoUrl(payment.payment_photo_url === 'null' ? null : payment.payment_photo_url);
        } else {
          setError('Tidak ada data pembayaran yang ditemukan.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memuat status pembayaran.');
      }
    } catch (err) {
      console.error('Error fetching payment status:', err);
      setError('Terjadi kesalahan jaringan atau server saat memuat status pembayaran.');
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

    const token = localStorage.getItem('authToken');

    if (!selectedFile) {
      setUploadMessage('Silakan pilih file bukti pembayaran terlebih dahulu.');
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
          Authorization: `Bearer ${token}`,
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
        // Menggunakan SweetAlert2 untuk notifikasi sukses
        MySwal.fire({
          title: 'Sukses!',
          text: data.message || 'Bukti pembayaran berhasil diunggah.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Memperbarui data setelah SweetAlert ditutup
          fetchPaymentStatus();
        });

        setSelectedFile(null);
        setUploadMessage('');

      } else {
        // Menggunakan SweetAlert2 untuk notifikasi gagal
        MySwal.fire({
          title: 'Gagal!',
          text: data.message || 'Gagal mengunggah bukti pembayaran.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
  
    } catch (err) {
      console.error('❌ Upload error:', err);
      MySwal.fire({
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 font-sans text-gray-800">
        <p className="text-red-600 text-lg mb-4 text-center">{error}</p>
        {/* <button
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Kembali ke Login
        </button> */}
      </div>
    );
  }

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
                <DetailItem label="Status Pembayaran" value={paymentDetails.status} />
                <DetailItem 
  label="Total Biaya" 
  value={`Rp ${(paymentDetails.totalFee || 0).toLocaleString("id-ID")}`} 
/>
              </div>
              
               
              )}
            </div>
          </div>

          {paymentStatus !== 'Success'  && (
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
