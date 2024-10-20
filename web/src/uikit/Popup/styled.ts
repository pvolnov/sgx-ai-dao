import { motion } from "framer-motion";
import styled from "styled-components";

export const ModalWrap = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export const ModalOverlay = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
`;

export const ModalContent = styled(motion.div)`
  background-color: var(--Elevation-0);
  border-radius: 16px;
  padding: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;
