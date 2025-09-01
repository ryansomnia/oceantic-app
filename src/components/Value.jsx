'use client';

import { Users, Target, Settings, Camera, Network } from 'lucide-react';

const reasons = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Tim Profesional & Passionate",
    desc: "Berpengalaman dalam olahraga dan event organizing dengan dedikasi penuh."
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Fokus pada Pelajar",
    desc: "Mendukung pembinaan usia dini dengan program yang terarah."
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: "Manajemen Modern",
    desc: "Sistem event yang efisien, rapi, dan transparan."
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Branding & Dokumentasi",
    desc: "Visual berkualitas tinggi untuk meningkatkan citra event."
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Jejaring Luas",
    desc: "Terhubung dengan sekolah, komunitas, dan media olahraga."
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-sky-600 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-14 text-center">
          MENGAPA MEMILIH<span className="text-yellow-400"> KAMI?</span>
        </h2>

        {/* Ubah grid jadi flex supaya row terakhir bisa center */}
        <div className="flex flex-wrap justify-center gap-10">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 w-full sm:w-[300px] rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center flex flex-col items-center"
            >
              <div className="mb-4 text-yellow-500">{item.icon}</div>
              <h3 className="text-xl text-yellow-500 font-semibold mb-3">{item.title}</h3>
              <p className="text-black leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
