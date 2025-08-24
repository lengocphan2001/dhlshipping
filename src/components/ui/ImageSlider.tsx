import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

interface Slide {
  id: number;
  image: string;
}

interface ImageSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
  showProductSection?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  slides, 
  autoPlay = true, 
  interval = 5000,
  showProductSection = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProductSlide, setCurrentProductSlide] = useState(0);

  const productSlides = [
    {
      id: 1,
      title: 'Sản phẩm của chúng tôi'
    },
    {
      id: 2,
      title: 'BẠN TRAO TÔI NIỀM TIN CHÚNG TÔI TRAO BẠN SỰ HÀI LÒNG!'
    }
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  useEffect(() => {
    if (!showProductSection) return;
    
    const timer = setInterval(() => {
      setCurrentProductSlide((prev) => (prev + 1) % productSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [showProductSection, productSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="image-slider-container">
      {/* Main Image Slider */}
      <div className="image-slider">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="slider-arrow slider-arrow-left" onClick={goToPrevious}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button className="slider-arrow slider-arrow-right" onClick={goToNext}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Product Section - Conditionally rendered */}
      {showProductSection && (
        <div className="product-section">
          <div className="container text-center">
            <div className="carousel-container">
              <div className="carousel-inner">
                {productSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`carousel-item ${index === currentProductSlide ? 'active' : ''}`}
                  >
                    <h2>{slide.title}</h2>
                  </div>
                ))}
              </div>
              <div className="carousel-indicators">
                {productSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`indicator ${index === currentProductSlide ? 'active' : ''}`}
                    onClick={() => setCurrentProductSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
