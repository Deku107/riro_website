import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/variants';

const AboutStrip = () => {
  return (
    <section className="bg-white border-y border-gray-100 section-padding py-10">
      <motion.div
        className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6"
        variants={fadeIn('up')}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-xl md:text-2xl font-display font-semibold">
          <span className="text-primary">RIRO Talehouse</span>
        </h2>
        <p className="text-sm md:text-base text-muted max-w-3xl">
          We are a next-gen studio delivering a streamlined script-to-screen experience for creators. We
          produce and distribute short films, music videos, digital/vertical series, and champion select
          works at major film festivals worldwide.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutStrip;
