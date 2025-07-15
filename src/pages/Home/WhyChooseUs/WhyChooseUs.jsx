import React from "react";
import { motion } from "framer-motion";
import { ChartLineUp, Leaf, Handshake, ShieldCheck } from "phosphor-react";

const features = [
  {
    icon: <ChartLineUp size={32} weight="duotone" />,
    title: "Real-Time Market Data",
    desc: "Stay updated with live price changes for local produce from verified vendors.",
  },
  {
    icon: <Leaf size={32} weight="duotone" />,
    title: "Freshness Guaranteed",
    desc: "Track the freshness and availability of products from your local markets.",
  },
  {
    icon: <Handshake size={32} weight="duotone" />,
    title: "Vendor Empowerment",
    desc: "Helping vendors set fair prices while ensuring transparency for buyers.",
  },
  {
    icon: <ShieldCheck size={32} weight="duotone" />,
    title: "Secure & Verified",
    desc: "We ensure that all price and vendor data is accurate and securely managed.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-8">
        Why Choose BazaarTrack?
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-md border border-green-100 rounded-xl p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-green-600 flex justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
