import React from 'react';
import { Github, Twitter, Linkedin, Mail, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Twitter size={18} />, href: 'https://twitter.com/yourhandle', label: 'Twitter' },
    { icon: <Github size={18} />, href: 'https://github.com/yourhandle', label: 'GitHub' },
    { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/yourhandle', label: 'LinkedIn' },
    { icon: <Mail size={18} />, href: 'mailto:hello@ness.com', label: 'Email' },
  ];

  return (
    <footer className="bg-[#050505] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-12 border-b border-white/5">
          <div className="max-w-md">
            <div className="flex items-center gap-2 font-bold text-white tracking-tighter text-xl mb-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Zap size={18} className="text-black fill-black" />
              </div>
              NESS
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A demonstration of high-integrity financial infrastructure design. 
              Built with precision to showcase modern engineering standards.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
              Connect
            </span>
            <div className="flex gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-gray-700 tracking-wider uppercase">
            © {currentYear} Handcrafted by Chandan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;