import { useEffect } from 'react';
import { Camera } from '@rnmapbox/maps';
import { Driver } from '@components/maps/types';

export const useFollowDriver = (
  cameraRef: React.RefObject<Camera>,
  driver: Driver | null,
) => {
  useEffect(() => {
    if (!driver || !cameraRef.current) return;

    cameraRef.current.flyTo(driver.coordinate, 1000);
  }, [driver]);
};
