export default function EventSection() {
    return (
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
      >
        <div className="relative z-10 text-black p-6 md:p-8">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg"> EVENT REGISTER </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
          daftar kan dirimu untuk event event renang terdekat </p>
          <a 
           href="/registerEvent"
            className="bg-sky-300 text-white text-xl font-bold py-4 px-10 rounded-full hover:bg-sky-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Daftar Sekarang 
          </a>
        </div>
      </section>
    );
  }