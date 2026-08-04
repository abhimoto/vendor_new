import { useEffect, useState } from 'react';
import { Driver } from '@components/maps/types';

const interpolate = (start: number, end: number, t: number) =>
  start + (end - start) * t;

export const useAnimatedDrivers = (drivers: Driver[]) => {
  const [animated, setAnimated] = useState<Driver[]>(drivers);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setAnimated(prev =>
        prev.map((d, i) => {
          const target = drivers[i];
          if (!target) return d;

          return {
            ...d,
            coordinate: [
              interpolate(d.coordinate[0], target.coordinate[0], 0.1),
              interpolate(d.coordinate[1], target.coordinate[1], 0.1),
            ],
          };
        }),
      );

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [drivers]);

  return animated;
};
