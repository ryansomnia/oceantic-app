import Image from 'next/image'; // Pastikan Anda mengimpor Image jika menggunakan next/image

export default function Events() {
  const events = [
    {
      title: "Summer Sprint Championship",
      date: "August 15, 3025",
      location: "Grand Aquatic Center",
      category: "U17, Gaya Punggung, 50 Meter",
      link: "/registerEvent",
      image: "/images/swim.jpg"
    },
    {
      title: "Winter Freestyle Challenge",
      date: "December 10, 3025",
      location: "Olympic Pool Complex",
      category: "Terbuka, Gaya Bebas, 200 Meter",
      link: "/registerEvent",
      image: "/images/swim.jpg"
    },
    {
      title: "Junior Dolphin Meet",
      date: "March 20, 2026",
      location: "Community Swim Club",
      category: "U12, All Styles, Fun Race",
      link: "/registerEvent",
      image: "/images/swim.jpg"
    },
  ];

  return (
    <section id="events" className="py-20 bg-white text-dark-charcoal">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
          Event <span className="text-aqua-accent">Terkini</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <div key={index} className="bg-soft-gray p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 text-left flex flex-col"> {/* Added flex-col here */}
              {event.image && (
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <h3 className="text-2xl font-semibold text-oceanic-blue mb-3">{event.title}</h3>
              <p className="text-lg text-gray-700 mb-2"><span className="font-medium">Date:</span> {event.date}</p>
              <p className="text-lg text-gray-700 mb-4"><span className="font-medium">Location:</span> {event.location}</p>

              {/* Kategori sebagai blok warna */}
              <div className="flex flex-wrap gap-2 mb-6"> {/* Kontainer untuk kategori */}
                {event.category.split(',').map((cat, catIndex) => (
                  <span key={catIndex} className="bg-emerald-300 text-black text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    {cat.trim()}
                  </span>
                ))}
              </div>

              {/* Tombol "Baca Selanjutnya" */}
              <div className="mt-auto"> {/* Ensures button is at the bottom */}
                <a href={event.link} className="inline-block bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-aqua-accent transition duration-300">
                  Baca Selanjutnya &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}