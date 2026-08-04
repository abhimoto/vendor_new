import Mapbox from '@rnmapbox/maps';

export const useOfflineMap = () => {
  const downloadRegion = async () => {
    await Mapbox.offlineManager.createPack({
      name: 'region',
      styleURL: Mapbox.StyleURL.Street,
      minZoom: 10,
      maxZoom: 16,
      bounds: [
        [72.7, 18.9],
        [73.0, 19.3],
      ],
    });
  };

  return { downloadRegion };
};
