import { useEffect, useState } from 'react';
import { Driver } from '@components/maps/types';

export const useSocketDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Driver 1',
      coordinate: [72.8777, 19.076], // Mumbai
      status: 'online',
    },
    {
      id: '2',
      name: 'Driver 2',
      coordinate: [72.88, 19.08],
      status: 'onTrip',
    },
    {
      id: '3',
      name: 'Driver 3',
      coordinate: [72.85, 19.07],
      status: 'offline',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev =>
        prev.map(driver => ({
          ...driver,
          // simulate movement (small coordinate change)
          coordinate: [
            driver.coordinate[0] + (Math.random() - 0.5) * 0.005,
            driver.coordinate[1] + (Math.random() - 0.5) * 0.005,
          ],
          // simulate status change randomly
          status: getRandomStatus(),
        })),
      );
    }, 2000); // update every 2 sec

    return () => clearInterval(interval);
  }, []);

  return drivers;
};

// helper function
const getRandomStatus = (): Driver['status'] => {
  const statuses: Driver['status'][] = ['online', 'offline', 'onTrip'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
