import React from 'react';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Services from '../../components/Services';
import Gallery from '../../components/Gallery';
import Products from '../../components/Products';
import Industries from '../../components/Industries';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';

export default function UserHome() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Services />
      <Products />
      <Industries />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
