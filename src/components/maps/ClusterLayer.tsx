import React from 'react';
import { ShapeSource, CircleLayer, SymbolLayer } from '@rnmapbox/maps';
import { Driver } from './types';

export default function ClusterLayer({ drivers }: { drivers: Driver[] }) {
  const geojson = {
    type: 'FeatureCollection',
    features: drivers.map(d => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: d.coordinate },
      properties: {},
    })),
  };

  return (
    <ShapeSource id="cluster" shape={geojson} cluster clusterRadius={50}>
      <CircleLayer
        id="circle"
        filter={['has', 'point_count']}
        style={{ circleRadius: 20, circleColor: '#1976D2' }}
      />
      <SymbolLayer
        id="count"
        filter={['has', 'point_count']}
        style={{ textField: '{point_count}', textColor: '#fff' }}
      />
    </ShapeSource>
  );
}
