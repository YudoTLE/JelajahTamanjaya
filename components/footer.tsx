import { Mail, Phone, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 space-y-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Contact</h4>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {' '}
            contact@tamanjaya.id
          </p>
          <p className="flex items-center gap-2 mt-1">
            <Phone className="w-4 h-4" />
            {' '}
            +62 812-3456-7890
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Gallery</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Social Media</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="flex gap-2" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
              Facebook
            </a>
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="GitHub"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full bg-secondary text-secondary-foreground text-sm px-2">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        Tamanjaya. All rights reserved.
      </div>
    </footer>
  );
}
