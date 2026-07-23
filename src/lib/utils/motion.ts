export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export const transitionLuxury = {
  duration: 1.2,
  ease: LUXURY_EASE,
} as const;

export const transitionQuick = {
  duration: 0.6,
  ease: LUXURY_EASE,
} as const;

export const springLuxury = {
  type: "spring",
  damping: 32,
  stiffness: 240,
} as const;

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionLuxury,
  },
} as const;

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionLuxury,
  },
} as const;

export const hoverScaleLuxury = {
  scale: 1.025,
  transition: { duration: 0.8, ease: LUXURY_EASE },
} as const;
