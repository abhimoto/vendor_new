export type Coordinate = [number, number];

export type DriverStatus = 'online' | 'offline' | 'onTrip';

export interface Driver {
  id: string;
  name: string;
  coordinate: Coordinate;
  status: DriverStatus;
}
