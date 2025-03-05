import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#4A628A] text-[#DFF2EB] py-4">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">
          © {new Date().getFullYear()} FitTracker. Todos los derechos reservados.
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/about" className="text-sm hover:text-[#7AB2D3]">Acerca de</Link>
          <Link to="/contact" className="text-sm hover:text-[#7AB2D3]">Contacto</Link>
          <Link to="/privacy" className="text-sm hover:text-[#7AB2D3]">Política de Privacidad</Link>
          <Link to="/terms" className="text-sm hover:text-[#7AB2D3]">Términos de Uso</Link>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#7AB2D3]">
            <FaFacebookF />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#7AB2D3]">
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#7AB2D3]">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
