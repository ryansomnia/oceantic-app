import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className=" text-black text-3xl font-bold">
          OCEANETIC
        </Link>
        <ul className="flex space-x-8 text-lg">
          <li>
            <Link href="#about-us" className="text-black hover:text-sky-300 transition duration-300">
              About Us
            </Link>
          </li>
          <li>
            <Link href="#events" className="text-black hover:text-sky-300 transition duration-300">
              Events
            </Link>
          </li>
          <li>
            <Link href="#achievements" className="text-black hover:text-sky-300 transition duration-300">
              Achievements
            </Link>
          </li>
          <li>
            <Link href="#testimonials" className="text-black hover:text-sky-300 transition duration-300">
              Testimonials
            </Link>
          </li>
          <li>
            <Link href="#contact-us" className="text-black hover:text-sky-300 transition duration-300">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/login" className="bg-sky-300 px-4 py-2 rounded-md text-white hover:bg-sky-500 transition duration-300">
              Login
            </Link>
          </li>
          <li>
            <Link href="/register" className=" border border-sky-900 px-4 py-2 rounded-md text-sky-300 hover:bg-sky-500 hover:text-white  transition duration-300">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}