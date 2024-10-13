import React from "react";
import L from 'leaflet';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import '../css/Map.css';

class MapComponent extends React.Component {
  state = {
    lat: 46.536032,
    lng: 41.031736,
    zoom: 10,
    basemap: 'osm',
    fieldsData: null // Для хранения данных полей
  };

  componentDidMount() {
    // Загрузите данные GeoJSON
    fetch('/path/to/your/fields.geojson') // Укажите путь к вашему GeoJSON файлу
      .then(response => response.json())
      .then(data => {
        console.log("Загруженные данные GeoJSON:", data); // Добавьте этот вывод
        this.setState({ fieldsData: data });
      });
  }

  render() {
    const center = [this.state.lat, this.state.lng];

    return (
      <Map center={center} zoom={this.state.zoom} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Добавьте слой GeoJSON, если данные загружены */}
        {this.state.fieldsData && (
          <GeoJSON 
            data={this.state.fieldsData} 
            style={() => ({
              color: 'red', // Измените цвет границы на более заметный
              weight: 5,
              opacity: 1,
              fillColor: 'rgba(255, 0, 0, 0.3)', // Измените цвет заливки на более заметный
              fillOpacity: 0.5
            })}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(feature.properties.name); // Отображение имени поля при клике
            }}
          />
        )}
      </Map>
    );
  }
}

export default MapComponent;
