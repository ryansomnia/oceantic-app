export default function Achievements() {
    return (
      <section id="achievements" className="py-20 bg-sky-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-12 relative pb-4">
             <span className="text-aqua-accent">Achievement kami</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white text-sky-600 p-8 rounded-lg shadow-md">
              <h3 className="text-6xl font-extrabold text-warm-gold mb-4">50+</h3>
              <p className="text-xl font-semibold">Successful Events Organized</p>
            </div>
            <div className="bg-white text-sky-600 p-8 rounded-lg shadow-md">
              <h3 className="text-6xl font-extrabold text-warm-gold mb-4">1000+</h3>
              <p className="text-xl font-semibold">Happy Participants</p>
            </div>
            <div className="bg-white text-sky-600 p-8 rounded-lg shadow-md">
              <h3 className="text-6xl font-extrabold text-warm-gold mb-4">Top 5%</h3>
              <p className="text-xl font-semibold">In Event Satisfaction Scores</p>
            </div>
          </div>
        </div>
      </section>
    );
  }