import React from 'react';
import Banner from '../Banner/Banner';
import Banner2 from '../Banner2/Banner2';
import ProductSection from '../ProductSection/ProductSection';
import AdvertisementHighlights from '../AdvertisementHighlights/AdvertisementHighlights';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import Testimonials from '../Testimonials/Testimonials';

const Home = () => {
  return (
    <div>
      <Banner2></Banner2>
      {/* <Banner></Banner> */}
      <ProductSection></ProductSection>
      <AdvertisementHighlights></AdvertisementHighlights>
      <WhyChooseUs></WhyChooseUs>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;