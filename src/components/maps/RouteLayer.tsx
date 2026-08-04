import React from 'react';
import { ShapeSource, LineLayer } from '@rnmapbox/maps';
import { Coordinate } from './types';

export default function RouteLayer({
  coordinates,
}: {
  coordinates: Coordinate[];
}) {
  if (!coordinates.length) return null;

  return (
    <ShapeSource
      id="route"
      shape={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}
    >
      <LineLayer id="line" style={{ lineWidth: 4, lineColor: '#0D47A1' }} />
    </ShapeSource>
  );
}
