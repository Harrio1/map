import React from "react";
import L from 'leaflet';
import { Map, TileLayer, Polygon } from "react-leaflet";
import '../css/Map.css'; // Убедитесь, что путь правильный после перемещения файла

class MapComponent extends React.Component {
  state = {
    lat: 46.536032,
    lng: 41.031736,
    zoom: 10,
    polygonCoordinates: [], // Для хранения координат полигона
    inputCoordinates: "" // Для хранения введенных координат
  };

  handleInputChange = (e) => {
    this.setState({ inputCoordinates: e.target.value });
  };

  addPolygon = () => {
    try {
      const coordinates = JSON.parse(this.state.inputCoordinates);
      if (Array.isArray(coordinates) && coordinates.length > 0) {
        this.setState({ polygonCoordinates: coordinates });
      } else {
        alert("Введите корректные координаты в формате [[lng, lat], [lng, lat], ...]");
      }
    } catch (error) {
      alert("Ошибка в формате координат. Убедитесь, что они введены в формате JSON.");
    }
  };

  render() {
    const center = [this.state.lat, this.state.lng];

    return (
      <div class="hello" style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
          <input
            type="text"
            placeholder='Введите координаты в формате [[lng, lat], [lng, lat], ...]'
            value={this.state.inputCoordinates}
            onChange={this.handleInputChange}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button onClick={this.addPolygon}>Создать заливку</button>
        </div>
        <Map center={center} zoom={this.state.zoom} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Добавьте полигон, если координаты заданы */}
          {this.state.polygonCoordinates.length > 0 && (
            <Polygon 
              positions={this.state.polygonCoordinates} 
              color='red'
              fillColor='rgba(255, 0, 0, 0.3)'
              fillOpacity={0.5}
            />
          )}
        </Map>
      </div>
    );
  }
}

export default MapComponent;
