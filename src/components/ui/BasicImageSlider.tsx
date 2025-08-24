import React, { useState, useEffect } from 'react';
import './BasicImageSlider.css';

interface Slide {
  id: number;
  name: string;
  image: string;
}

interface BasicImageSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

const BasicImageSlider: React.FC<BasicImageSliderProps> = ({ 
  slides, 
  autoPlay = true, 
  interval = 3000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(slides);
  // Create circular array by duplicating slides
  const circularSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= slides.length ? 0 : nextSlide;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  return (
    <div className="basic-image-slider">
      <div className="slider-container">
        <div 
          className="slider-track" 
          style={{ 
            transform: `translateX(-${currentSlide * (100 / 4)}%)`,
            width: `${(circularSlides.length / 4) * 100}%`
          }}
        >
          {circularSlides.map((slide, index) => (
            <div key={`${slide.id}-${index}`} className="slide">
              <img src={slide.image} alt={slide.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicImageSlider;
