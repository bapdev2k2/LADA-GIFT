'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="relative py-2">
      <motion.div
        className="section-divider mx-auto w-full max-w-4xl"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  );
}
