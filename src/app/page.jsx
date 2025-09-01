import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Events from '../components/Event';
import Achievements from '../components/Achievements';
import Testimonials from '../components/Testimonials';
import ContactUs from '../components/ContactUs';
import EventSection from '../components/EventSection';
import Value from '../components/Value';
import Sponsorships from '../components/Sponsorship';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Value />
      <Events />
      <EventSection />
      {/* <Achievements /> */}
      <Testimonials />
      {/* <Sponsorships/> */}

      {/* <ContactUs /> */}
    </>
  );
}