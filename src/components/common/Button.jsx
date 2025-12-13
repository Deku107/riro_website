import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', ...rest }) => {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost';

  return (
    <motion.button whileTap={{ scale: 0.96 }} className={base} type="button" {...rest}>
      {children}
    </motion.button>
  );
};

export default Button;
