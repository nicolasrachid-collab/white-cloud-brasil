import React from 'react';
import { BRANDS } from '../constants';

interface Logos3Props {
  heading?: string;
}

export function Logos3({ heading = "As Melhores Marcas" }: Logos3Props) {
  if (!BRANDS || BRANDS.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
        {heading}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {BRANDS.map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all duration-300"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-w-full h-auto max-h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

