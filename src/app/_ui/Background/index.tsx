'use client';

import { forwardRef } from 'react';
import StarfieldLayer, { StarfieldHandle } from './StarfieldLayer';

const Background = forwardRef<StarfieldHandle>((props, ref) => {
  return <StarfieldLayer ref={ref} />;
});

Background.displayName = 'Background';

export default Background;
export type { StarfieldHandle };