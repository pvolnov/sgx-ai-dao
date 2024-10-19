import { motion } from "framer-motion";
import { colors } from "./theme";

export const ActivityIndicator = (props: any) => {
  return (
    <svg width="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props} style={Object.assign({ fill: colors.iconSecondary }, props?.style)}>
      <motion.circle cx="4" cy="12" r="3" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.8 }} />
      <motion.circle cx="12" cy="12" r="3" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.65 }} />
      <motion.circle cx="20" cy="12" r="3" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
    </svg>
  );
};
