export default function ContactUs() {
    return (
      <section id="contact-us" className="py-20 bg-white text-dark-charcoal">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-oceanic-blue mb-12 relative pb-4">
            Get in <span className="text-aqua-accent">Touch</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-aqua-accent rounded-full"></span>
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Have questions, partnership inquiries, or just want to say hello? Fill out the form below or reach out directly!
          </p>
          <div className="max-w-2xl mx-auto bg-soft-gray p-10 rounded-lg shadow-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-left text-lg font-medium text-dark-charcoal mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue text-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-left text-lg font-medium text-dark-charcoal mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue text-lg"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-left text-lg font-medium text-dark-charcoal mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue text-lg"
                  placeholder="Tell us about your inquiry..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-oceanic-blue text-white text-xl font-bold py-4 rounded-lg hover:bg-aqua-accent transition duration-300 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
  