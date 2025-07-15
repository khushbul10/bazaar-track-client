import React from 'react';
import Banner from '../Banner/Banner';
import Banner2 from '../Banner2/Banner2';
import ProductSection from '../ProductSection/ProductSection';
import AdvertisementHighlights from '../AdvertisementHighlights/AdvertisementHighlights';

const Home = () => {
  return (
    <div>
      <Banner2></Banner2>
      {/* <Banner></Banner> */}
      <ProductSection></ProductSection>
      <AdvertisementHighlights></AdvertisementHighlights>
    </div>
  );
};

export default Home;