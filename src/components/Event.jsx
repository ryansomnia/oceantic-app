export default function Events() {
    const events = [
      {
        title: "Summer Sprint Championship",
        date: "August 15, 2025",
        location: "Grand Aquatic Center",
        description: "A thrilling sprint competition for all age groups. Break your personal bests!",
        link: "#"
      },
      {
        title: "Winter Freestyle Challenge",
        date: "December 10, 2025",
        location: "Olympic Pool Complex",
        description: "Test your endurance in our annual freestyle marathon. Open to all levels.",
        link: "#"
      },
      {
        title: "Junior Dolphin Meet",
        date: "March 20, 2026",
        location: "Community Swim Club",
        description: "A fun and encouraging event for young swimmers to show their skills.",
        link: "#"
      },
    ];
  
    return (
      <section id="events" className="py-20 bg-white text-dark-charcoal">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
            Our <span className="text-aqua-accent">Events</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <div key={index} className="bg-soft-gray p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 text-left">
                <h3 className="text-2xl font-semibold text-oceanic-blue mb-3">{event.title}</h3>
                <p className="text-lg text-gray-700 mb-2"><span className="font-medium">Date:</span> {event.date}</p>
                <p className="text-lg text-gray-700 mb-4"><span className="font-medium">Location:</span> {event.location}</p>
                <p className="text-gray-600 mb-6">{event.description}</p>
                <a href={event.link} className="text-aqua-accent font-bold hover:underline">
                  Learn More &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }