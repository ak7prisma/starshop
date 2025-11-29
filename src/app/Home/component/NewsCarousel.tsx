"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { NewsItem } from "@/datatypes/newsType";

interface NewsCarouselProps {
  newsList: NewsItem[];
}

export default function NewsCarousel({ newsList }: Readonly<NewsCarouselProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasNews = newsList && newsList.length > 0;

  const nextSlide = useCallback(() => {
    if (!hasNews) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === newsList.length - 1 ? 0 : prevIndex + 1
    );
  }, [hasNews, newsList.length]);

  const prevSlide = () => {
    if (!hasNews) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsList.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || !hasNews) return;

    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [currentIndex, isPaused, nextSlide, hasNews]);

  if (!hasNews) {
    return null;
  }

  const newsMenuBase = "h-3 w-3 duration-300 rounded-full transition-all cursor-pointer border border-slate-600";
  const newsMenuActive = "w-9 bg-indigo-600 border-indigo-600";
  const newsMenuInactive = "bg-gray-500 hover:bg-gray-400";

  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-5 md:mt-0">
      
      <div 
        className="relative overflow-hidden w-full h-56 md:h-96 mb-10 bg-indigo-700 rounded-lg shadow-2xl z-10"
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
      >

        <div 
          className="flex h-full transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {newsList.map((news) => (
          
            <div key={news.idNews} className="min-w-full h-full relative group overflow-hidden">
               <Link href={news.href || "#"} className="block w-full h-full">
                
                  <img
                    src={news.imgUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    draggable={false}
                  />
              
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                   
                     <h3 className="text-white font-bold text-sm md:text-xl truncate drop-shadow-md">
                        {news.title}
                     </h3>
                  
                     {news.description && (
                        <p className="hidden sm:block text-gray-200 text-xs md:text-sm line-clamp-2 mt-1 drop-shadow-sm">
                            {news.description}
                        </p>
                     )}
                  </div>
               </Link>
            </div>
          ))}
        </div>

      </div>

      <div className="flex justify-center items-center space-x-3 mb-6">
        
        <button 
            onClick={prevSlide}
            className="text-slate-500 hover:text-indigo-500 duration-300 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
            aria-label="Previous Slide"
        >
            <RiArrowLeftWideLine size={35} />
        </button>

        <div className="flex space-x-2">
            {newsList.map((news, index) => (
                <button
                    key={news.idNews}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`${newsMenuBase} ${
                        currentIndex === index ? newsMenuActive : newsMenuInactive
                    }`}
                ></button>
            ))}
        </div>

        <button 
            onClick={nextSlide}
            className="text-slate-500 hover:text-indigo-500 duration-300 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
            aria-label="Next Slide"
        >
            <RiArrowRightWideLine size={35} />
        </button>

      </div>
    </div>
  );
}