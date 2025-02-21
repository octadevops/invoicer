// components/Footer.js
import React from "react";

const Footer = () => {
  const CurrentYear = new Date().getFullYear();

  return (
    <footer className=" sticky bottom-0 bg-gray-800 text-white p-4 text-center">
      <p> All rights reserved. &copy; 2024-{CurrentYear} Invoice Manager.</p>
    </footer>
  );
};

export default Footer;
