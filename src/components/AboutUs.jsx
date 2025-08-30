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
            Kami adalah tim yang berdedikasi, bersemangat terhadap jiwa kompetisi dan berkomitmen untuk menyelenggarakan acara yang lancar dan menginspirasi di berbagai disiplin olahraga untuk para atlet dan penggemar. Fokus kami adalah membina komunitas yang dinamis, mempromosikan kompetisi yang sehat, dan menciptakan momen tak terlupakan dalam dunia olahraga.</p>

            <p>
            Dari kejuaraan lokal hingga grand prix internasional, OCEANTIC menghadirkan profesionalisme, presisi, dan semangat dalam setiap acara. Kami percaya pada kekuatan olahraga untuk mempersatukan, menantang, dan mengubah. Bergabunglah bersama kami dalam membentuk masa depan keunggulan kompetitif!          </p>
            {/* Anda bisa menambahkan gambar di sini */}
            {/* <img src="/images/swim.jpg" alt="OCEANTIC Team" className="mt-10 rounded-lg shadow-lg mx-auto max-w-full h-auto" /> */}
          </div>
        </div>
      </section>
    );
  }