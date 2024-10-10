import { MapLayer } from 'react-leaflet';
import L from 'leaflet';

export default class GpsLayer extends MapLayer {
  createLeafletElement(props) {
    const { data } = props;

    // Создаем слой для GPS данных
    const gpsLayer = L.layerGroup();

    // Добавляем маркеры для каждой точки GPS
    data.forEach(point => {
      const marker = L.marker([point.lat, point.lng]);
      gpsLayer.addLayer(marker);
    });

    this.leafletElement = gpsLayer;
    return this.leafletElement;
  }

  updateLeafletElement(fromProps, toProps) {
    // Обновляем слой при изменении данных
    if (toProps.data !== fromProps.data) {
      this.leafletElement.clearLayers();
      this.createLeafletElement(toProps);
    }
  }
}
