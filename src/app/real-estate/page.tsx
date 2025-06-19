"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Home, MapPin, Bed, Bath, Ruler, Heart } from 'lucide-react';
import Link from 'next/link';

const properties = [
  {
    id: 1,
    title: 'Luxury Apartment in Ikoyi',
    location: 'Ikoyi, Lagos',
    price: '$850,000',
    beds: 4,
    baths: 3,
    area: 2800,
    image: '/properties/property1.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Modern Duplex in Lekki',
    location: 'Lekki Phase 1, Lagos',
    price: '$650,000',
    beds: 5,
    baths: 4,
    area: 3200,
    image: '/properties/property2.jpg'
  },
  {
    id: 3,
    title: 'Waterfront Mansion',
    location: 'Banana Island, Lagos',
    price: '$2,500,000',
    beds: 7,
    baths: 6,
    area: 8500,
    image: '/properties/property3.jpg',
    featured: true
  },
  {
    id: 4,
    title: 'Executive Bungalow',
    location: 'Victoria Island, Lagos',
    price: '$1,200,000',
    beds: 6,
    baths: 5,
    area: 4500,
    image: '/properties/property4.jpg'
  },
];

const benefits = [
  {
    title: 'Prime Locations',
    description: 'Exclusive access to premium properties in the most sought-after neighborhoods.',
    icon: <MapPin className="w-8 h-8 text-[var(--primary)]" />
  },
  {
    title: 'Investment Growth',
    description: 'Consistent property value appreciation in our carefully selected locations.',
    icon: <ArrowRight className="w-8 h-8 text-[var(--primary)]" />
  },
  {
    title: 'Rental Income',
    description: 'Opportunity for steady passive income through our managed rental program.',
    icon: <Home className="w-8 h-8 text-[var(--primary)]" />
  }
];

const Page = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProperties = activeTab === 'all' 
    ? properties 
    : properties.filter(property => property.featured);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Premium Real Estate Investments</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Discover exclusive properties and investment opportunities in Nigeria's most desirable locations
            </p>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="mx-auto w-[90%] md:w-[85%] py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Featured Properties</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full ${activeTab === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}
            >
              All Properties
            </button>
            <button 
              onClick={() => setActiveTab('featured')}
              className={`px-6 py-2 rounded-full ${activeTab === 'featured' ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}
            >
              Featured
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image 
                  src={property.image} 
                  alt={property.title} 
                  fill
                  className="object-cover"
                />
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                  <span className="text-lg font-semibold text-[var(--primary)]">{property.price}</span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {property.location}
                </p>
                <div className="flex justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Bed className="w-4 h-4 mr-1" /> {property.beds} Beds
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Bath className="w-4 h-4 mr-1" /> {property.baths} Baths
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Ruler className="w-4 h-4 mr-1" /> {property.area} sq.ft
                  </div>
                </div>
                <button className="mt-6 w-full bg-[var(--primary)] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto w-[90%] md:w-[85%]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Invest in Real Estate with Us?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We provide access to premium real estate investments with high growth potential in Nigeria's most promising locations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--primary)] text-white py-16">
        <div className="mx-auto w-[90%] md:w-[70%] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Real Estate Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact our expert advisors today to explore exclusive investment opportunities tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-[var(--primary)] px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/properties" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[var(--primary)] transition-colors"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;