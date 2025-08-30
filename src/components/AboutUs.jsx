export default function AboutUs() {
    return (
      <section id="about-us" className="py-20 bg-soft-gray text-dark-charcoal">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
            Apa itu <span className="text-aqua-accent">OCEANTIC</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
          </h2>
          <div className="max-w-4xl mx-auto text-lg leading-relaxed">
            <p className="mb-6">
            Oceantic adalah event organizer yang bergerak di bidang pengembangan minat dan
bakat pelajar melalui kompetisi olahraga air, khususnya renang. Berbasis di Jakarta,
Oceantic fokus menyelenggarakan acara lomba renang pelajar dengan konsep yang
menyenangkan, kompetitif, dan edukatif.
Kami percaya bahwa renang bukan hanya olahraga, tapi juga sarana pembentukan
karakter, daya juang, dan sportivitas anak muda.</p>
            {/* <p> */}
            {/* Dari kejuaraan lokal hingga grand prix internasional, OCEANTIC menghadirkan profesionalisme, presisi, dan semangat dalam setiap acara. Kami percaya pada kekuatan olahraga untuk mempersatukan, menantang, dan mengubah. Bergabunglah bersama kami dalam membentuk masa depan keunggulan kompetitif!          </p>
            Anda bisa menambahkan gambar di sini */}
            {/* <img src="/images/swim.jpg" alt="OCEANTIC Team" className="mt-10 rounded-lg shadow-lg mx-auto max-w-full h-auto" /> */}
          </div>
        </div>
      </section>
    );
  }