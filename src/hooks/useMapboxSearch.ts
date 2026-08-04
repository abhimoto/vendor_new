import { useState } from 'react';

const TOKEN = 'YOUR_MAPBOX_TOKEN';

export const useMapboxSearch = () => {
  const [results, setResults] = useState<any[]>([]);

  const searchPlaces = async (query: string) => {
    if (!query) return;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${TOKEN}`,
    );
    const data = await res.json();
    setResults(data.features || []);
  };

  return { results, searchPlaces };
};
