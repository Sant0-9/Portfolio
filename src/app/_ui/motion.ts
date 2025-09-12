import { MOTION_DISABLED } from './hooks/useReducedMotion';

// Animation duration tokens
export const dur = {
  fast: 0.25,
  base: 0.45,
  slow: 0.8
} as const;

// Easing tokens
export const ease = {
  out: [0.25, 0.1, 0.25, 1] as const,
  inout: [0.4, 0.0, 0.2, 1] as const
} as const;

// Base motion variants that respect MOTION_DISABLED
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DISABLED ? 0 : dur.base,
      ease: ease.out
    }
  }
};

export const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DISABLED ? 0 : dur.base,
      ease: ease.out
    }
  }
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DISABLED ? 0 : dur.base,
      ease: ease.out
    }
  }
};

export const reveal = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: MOTION_DISABLED ? 0 : dur.slow,
      ease: ease.out
    }
  }
};

// Utility function to create responsive variants
export function createResponsiveVariant(
  baseVariant: typeof fadeInUp,
  mobileModifier: Partial<typeof baseVariant.visible> = {}
) {
  if (MOTION_DISABLED) {
    return {
      hidden: baseVariant.visible,
      visible: baseVariant.visible
    };
  }

  return {
    hidden: baseVariant.hidden,
    visible: {
      ...baseVariant.visible,
      ...mobileModifier
    }
  };
}

// Viewport settings for intersection observer
export const viewport = {
  once: true,
  margin: '0px 0px -10% 0px'
} as const;