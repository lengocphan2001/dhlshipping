import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import ServicePanels from '../components/sections/ServicePanels';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import VisionMission from '../components/sections/VisionMission';
import SaleSection from '../components/sections/SaleSection';
import NewsSection from '../components/sections/NewsSection';
import ImageSlider from '../components/ui/ImageSlider';
import Footer from '../components/sections/Footer';
import firstSliderImage from '../assets/images/first-slider.jpg';
import secondSliderImage from '../assets/images/second-slider.jpg';
import thirdSliderImage from '../assets/images/third-slider.jpg';
import './HomePage.css';

const HomePage: React.FC = () => {
  const slides = [
    {
      id: 1,
      image: firstSliderImage
    },
    {
      id: 2,
      image: secondSliderImage
    },
    {
      id: 3,
      image: thirdSliderImage
    }
  ];

  return (
    <Layout>
      <div className="home-page">
        <ImageSlider slides={slides} />
        <ServicePanels />
        <HeroSection />
        <WhyChooseUs />
        <VisionMission />
        <NewsSection />
        <Footer />
      </div>
    </Layout>
  );
};

export default HomePage;
