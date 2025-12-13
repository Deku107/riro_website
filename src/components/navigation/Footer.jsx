import React from 'react';
import { siteConfig } from '../../config/siteConfig';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="section-padding py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {siteConfig.brand}. All rights reserved.
        </p>
        <p>Crafted for storytellers, filmmakers & creators worldwide.</p>
      </div>
    </footer>
  );
};

export default Footer;
