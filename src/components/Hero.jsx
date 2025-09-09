export default function Hero() {
    return (
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/swim.jpg')" }} // Pastikan gambar ada di public/images
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white p-6 md:p-8">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
        Dive Into Excellence with<br /><span className="text-aqua-accent">OCEANTIC</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
          Bergabung bersama acara olahraga profesional dan pengalaman tak terlupakan bagi atlet dan penggemar.          </p>
          <a 
            href="/#events" 
            className="bg-sky-300 text-white text-xl font-bold py-4 px-10 rounded-full hover:bg-sky-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore Events Terdekat
          </a>
        </div>
      </section>
    );
  }