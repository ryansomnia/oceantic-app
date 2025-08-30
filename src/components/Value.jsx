import { FaUsers, FaGraduationCap, FaCogs, FaCamera, FaNetworkWired } from "react-icons/fa";

export default function Value() {
  const values = [
    {
      icon: <FaUsers className="text-3xl text-aqua-accent" />,
      text: "Tim profesional & passionate dalam bidang olahraga dan event organizing",
    },
    {
      icon: <FaGraduationCap className="text-3xl text-aqua-accent" />,
      text: "Fokus pada pelajar dan pembinaan usia dini",
    },
    {
      icon: <FaCogs className="text-3xl text-aqua-accent" />,
      text: "Sistem manajemen event modern dan efisien",
    },
    {
      icon: <FaCamera className="text-3xl text-aqua-accent" />,
      text: "Branding visual & dokumentasi berkualitas",
    },
    {
      icon: <FaNetworkWired className="text-3xl text-aqua-accent" />,
      text: "Jejaring yang luas dengan sekolah, komunitas, dan media olahraga",
    },
  ];

  return (
    <section id="value" className="py-20 bg-sky-600 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 relative pb-4">
          Mengapa <span className="text-aqua-accent">Memilih Kami?</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          {values.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-white/10 p-6 rounded-xl hover:bg-white/20 transition duration-300"
            >
              <div className="flex-shrink-0 bg-white/20 p-4 rounded-full">
                {item.icon}
              </div>
              <p className="text-base md:text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
