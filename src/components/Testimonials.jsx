import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'; // Anda perlu menginstal react-icons

export default function Testimonials() {
  const testimonials = [
    {
      quote: "OCEANETIC organized an incredible event! Everything was seamless, and the atmosphere was fantastic. I highly recommend them for any swimming competition.",
      author: "Sarah L.",
      title: "Competitive Swimmer"
    },
    {
      quote: "The attention to detail and participant experience provided by OCEANETIC is unmatched. Our team always looks forward to their events.",
      author: "Coach Mark R.",
      title: "Swim Team Coach"
    },
    {
      quote: "As a parent, I appreciate the professional and supportive environment OCEANETIC creates. My kids absolutely love participating!",
      author: "Jessica P.",
      title: "Parent"
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-soft-gray text-dark-charcoal">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
          What Our <span className="text-aqua-accent">Participants Say</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between items-center text-center">
              <FaQuoteLeft className="text-warm-gold text-3xl mb-4" />
              <p className="text-lg italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <FaQuoteRight className="text-warm-gold text-3xl mt-4" />
              <div className="mt-6">
                <p className="text-xl font-semibold text-oceanic-blue">{testimonial.author}</p>
                <p className="text-md text-gray-600">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}