'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

export default function Slider() {
  const slides = [

      { src: '/images/competition.gif', text: 'Competition' },
      { src: '/images/conference.gif', text: 'Conference'},
      { src: '/images/consulting.gif', text: 'Consulting' },
    // { src: '/image/four.png', text: 'Machine Learning Systems (Stanford Pre-Collegiate Summer Institute)', para:"Designed AI systems in Python under mentorship from top AI researchers." },
    
  ];

  return (
    <div className='bg-gray-50 py-1 px-3 md:px-6' id="projects">
        {/* <h1 className='text-center text-3xl my-2 md:text-4xl font-bold mb-6 text-indigo-700'>Engineering Projects</h1> */}
      <div className="w-full h-screen overflow-hidden relative">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="relative flex justify-center items-center h-full"
            >
              <img
                src={slide.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-white my-1 text-6xl md:text-9xl font-extrabold drop-shadow-lg">
                  {slide.text}
                </h2>
                {/* <p className='text-white text-2xl md:text-3xl font-bold'>
                    {slide.para}
                </p> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}