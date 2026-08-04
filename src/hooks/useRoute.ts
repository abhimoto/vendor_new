import { useState } from 'react';
import { Coordinate } from '@components/maps/types';
import { GOOGLE_API_KEY } from './../config/google';

const TOKEN = GOOGLE_API_KEY;

export const useRoute = () => {
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [eta, setEta] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const getRoute = async (from: Coordinate, to: Coordinate) => {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${from.join(
        ',',
      )};${to.join(',')}?geometries=geojson&access_token=${TOKEN}`,
    );

    const data = await res.json();
    const r = data.routes[0];

    setRoute(r.geometry.coordinates);
    setEta((r.duration / 60).toFixed(2));
    setDistance((r.distance / 1000).toFixed(2));
  };

  return { route, eta, distance, getRoute };
};
