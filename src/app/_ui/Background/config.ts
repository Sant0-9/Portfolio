export const STAR_COUNTS = {
  desktop: [80, 50, 30],
  mobile: [40, 25, 15]
};

export const PARALLAX = {
  depth1: 0.03,
  depth2: 0.06,
  mouse: 0.03
};

export const AURORA = {
  opacity: 0.22,
  speedA: 42000, // 42s
  speedB: 51000  // 51s
};

export const SHOOTING = {
  minMs: 20000,  // 20s
  maxMs: 35000,  // 35s
  speed: 1.8
};

export function reducedForMobile(width: number) {
  const isMobile = width < 768;
  
  return {
    starCounts: isMobile ? STAR_COUNTS.mobile : STAR_COUNTS.desktop,
    parallax: isMobile ? {
      depth1: PARALLAX.depth1 * 0.5,
      depth2: PARALLAX.depth2 * 0.5,
      mouse: PARALLAX.mouse * 0.5
    } : PARALLAX,
    aurora: isMobile ? {
      ...AURORA,
      speedA: AURORA.speedA * 1.2,
      speedB: AURORA.speedB * 1.2
    } : AURORA,
    shooting: isMobile ? {
      ...SHOOTING,
      speed: SHOOTING.speed * 0.8
    } : SHOOTING
  };
}