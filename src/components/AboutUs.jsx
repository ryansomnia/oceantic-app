export default function AboutUs() {
    return (
      <section id="about-us" className="py-20 bg-soft-gray text-dark-charcoal">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
            About <span className="text-aqua-accent">OCEANTIC</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
          </h2>
          <div className="max-w-4xl mx-auto text-lg leading-relaxed">
            <p className="mb-6">
              We are a dedicated team passionate about swimming, committed to organizing seamless and inspiring events for athletes and enthusiasts alike. Our focus is on fostering community, promoting healthy competition, and creating memorable moments in the aquatic world.
            </p>
            <p>
              From local championships to international grand prix, OCEANTIC brings professionalism, precision, and passion to every stroke. We believe in the power of water to unite, challenge, and transform. Join us in making waves!
            </p>
            {/* Anda bisa menambahkan gambar di sini */}
            {/* <img src="/images/about-us-team.jpg" alt="OCEANTIC Team" className="mt-10 rounded-lg shadow-lg mx-auto max-w-full h-auto" /> */}
          </div>
        </div>
      </section>
    );
  }