import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { MapView, Camera } from '@rnmapbox/maps';
import DriverMarker from './DriverMarker';
import RouteLayer from './RouteLayer';
import ClusterLayer from './ClusterLayer';
import SearchBox from './SearchBox';
import { useFollowDriver } from './../../hooks/useFollowDriver';
import { Driver } from './types';

interface Props {
  drivers: Driver[];
  selectedDriver: Driver | null;
  onMarkerPress: (d: Driver) => void;
  searchHook: any;
  route: any;
  eta: string | null;
  distance: string | null;
  showSearch?: boolean;
}

export default function AdvancedMap({
  drivers,
  selectedDriver,
  onMarkerPress,
  searchHook,
  route,
  eta,
  distance,
  showSearch = true,
}: Props) {
  const cameraRef = useRef<Camera>(null);

  useFollowDriver(cameraRef, selectedDriver);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}>
        <Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[72.8777, 19.076]}
        />

        <RouteLayer coordinates={route} />
        <ClusterLayer drivers={drivers} />

        {drivers.map(d => (
          <DriverMarker key={d.id} driver={d} onPress={onMarkerPress} />
        ))}
      </MapView>

      {showSearch && searchHook && (
        <SearchBox
          searchHook={searchHook}
          onSelect={(place: any) => {
            cameraRef.current?.flyTo(place.geometry.coordinates, 1000);
          }}
        />
      )}

      {eta && (
        <View style={{ position: 'absolute', bottom: 120, left: 20 }}>
          <Text>ETA: {eta} min</Text>
          <Text>Distance: {distance} km</Text>
        </View>
      )}
    </View>
  );
}
