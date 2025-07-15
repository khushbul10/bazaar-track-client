import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Oggy",
    role: "Vendor at Bou Bazar",
    image: "https://res.cloudinary.com/di9ukzsxb/image/upload/v1752416979/bazaartrack/k3031qdwcfvnlcsnop2g.jpg",
    text: "BazaarTrack has made it so much easier for me to track and adjust my vegetable prices fairly. My customers are happier and sales have improved!",
  },
  {
    name: "Mina",
    role: "Local Buyer",
    image: "https://i.ibb.co/8M0CM5w/default-avatar.png",
    text: "As a buyer, I can easily check fresh produce prices from home and plan my purchases, saving time and money!",
  },
  {
    name: "Vendor Raju",
    role: "Vendor at City Market",
    image: "https://i.ibb.co/8M0CM5w/default-avatar.png",
    text: "Transparency is key in local markets, and BazaarTrack provides just that with live updates and easy tracking.",
  },
];

const Testimonials = () => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      


      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
        Hear From Our Users
      </h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        spaceBetween={20}
        slidesPerView={1}
        loop
      >
        {testimonials.map((testimonial, idx) => (
          <SwiperSlide key={idx}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-[2px]  border border-green-100 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-green-200 mb-4"
              />
              <h3 className="text-lg font-semibold text-green-800">{testimonial.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{testimonial.role}</p>
              <p className="text-gray-700 text-sm max-w-md">{testimonial.text}</p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
