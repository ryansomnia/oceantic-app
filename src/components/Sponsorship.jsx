import React from 'react';

export default function Sponsorships() {
  const sponsors = [
    { name: 'Global Tech Solutions', logo: 'https://via.placeholder.com/150x150/0A2E3D/FFFFFF?text=Logo+1' },
    { name: 'Innovate Minds Co.', logo: 'https://via.placeholder.com/150x150/1A4B5F/FFFFFF?text=Logo+2' },
    { name: 'Future Enterprises', logo: 'https://via.placeholder.com/150x150/2A6882/FFFFFF?text=Logo+3' },
    { name: 'Pinnacle Ventures', logo: 'https://via.placeholder.com/150x150/3A85A5/FFFFFF?text=Logo+4' },
    { name: 'Dynamic Solutions Inc.', logo: 'https://via.placeholder.com/150x150/4AA1C7/FFFFFF?text=Logo+5' },
    { name: 'Elite Systems', logo: 'https://via.placeholder.com/150x150/5ABDE9/FFFFFF?text=Logo+6' },
    { name: 'Synergy Corp', logo: 'https://via.placeholder.com/150x150/6ACCFB/FFFFFF?text=Logo+7' },
    { name: 'Bright Future Media', logo: 'https://via.placeholder.com/150x150/7BD9FF/FFFFFF?text=Logo+8' },
    // Anda bisa menambahkan lebih banyak sponsor di sini
  ];

  return (
    <section id="sponsorships" className="py-20 bg-gradient-to-r bg-white text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-12 relative pb-4">
          <span className="text-cyan-300">Our Valued Sponsors</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cyan-300 rounded-full"></span>
        </h2>

        <p className="text-lg mb-12 max-w-3xl mx-auto opacity-90">
          We are incredibly grateful for the support of our partners who make our initiatives possible.
          Their commitment helps us achieve our goals and deliver impactful experiences.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-center">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 transition-all duration-300 transform hover:-translate-y-1">
              {/* Container untuk gambar lingkaran */}
              <div className="w-32 h-32  md:w-40 md:h-40 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-sky-400">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} Logo`}
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-filter duration-300"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-white font-semibold text-lg">{sponsor.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-xl font-semibold mb-4">
            Interested in partnering with us?
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=62895365089206&text&type=phone_number&app_absent=0"
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-sky-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
}
