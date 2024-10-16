import React from "react";
import L from 'leaflet';
import { Map, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl,
  Polygon,
   } from "react-leaflet";

import '../css/Map.css';
import { connect } from "react-redux";
import Basemap from './Basemaps'; // Импортируем компонент Basemap

// указываем путь к файлам marker
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends React.Component {
  state = {
    // Установите координаты для Целинского района Ростовской области
    lat: 46.536032,  // Широта
    lng: 41.031736, // Долгота
    zoom: 10,     // Увеличение для более детального просмотра
    basemap: 'osm', // Убедитесь, что это значение существует в basemapsDict
    polygons: [], // Массив для хранения заливок
    inputCoordinates: [], // Массив для хранения введенных координат
  };

  // Переместите basemapsDict сю��а
  basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    mapbox: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.png"
  };

  colors = ['red', 'blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'yellow', 'brown']; // Массив цветов

  handleInputChange = (e) => {
    const { value } = e.target;
    const coordinates = value.split(',').map(coord => coord.trim()).filter(coord => coord); // Разделяем по запятой и очищаем пробелы
    this.setState({ inputCoordinates: coordinates });
  };

  addPolygon = () => {
    const { inputCoordinates } = this.state;
    if (inputCoordinates.length >= 4 && inputCoordinates.length <= 9) {
      const coordinates = inputCoordinates.map(coord => {
        const [lat, lng] = coord.split(' ').map(Number);
        return [lat, lng];
      });

      // Добавьте первую точку в конец массива, чтобы замкнуть полигон
      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }

      const newPolygon = {
        id: this.state.polygons.length + 1,
        coordinates: coordinates,
        color: this.colors[this.state.polygons.length % this.colors.length]
      };

      this.setState(prevState => ({
        polygons: [...prevState.polygons, newPolygon],
        inputCoordinates: []
      }));
      console.log("Polygon added:", newPolygon);
    } else {
      alert("Введите от 4 до 9 координат в формате 'lat lng', разделенные запятыми.");
    }
  };

  handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newCoordinates = [...this.state.inputCoordinates, `${lat} ${lng}`]; // Добавляем координаты в формате 'lat lng'
    this.setState({
      inputCoordinates: newCoordinates
    });
  };

  changeBasemap = (basemap) => {
    this.setState({ basemap });
  };

  render() {
    const center = [this.state.lat, this.state.lng];
    const basemapUrl = this.basemapsDict[this.state.basemap];

    if (!basemapUrl) {
      console.error('Basemap URL is undefined');
      return null;
    }

    return (
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
          <input
            type="text"
            placeholder='Введите координаты в формате "lat lng", разделенные запятыми'
            value={this.state.inputCoordinates.join(', ')}
            onChange={this.handleInputChange}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button onClick={this.addPolygon}>Сохранить заливку</button>
        </div>
        <Map
          zoomControl={false}
          zoom={this.state.zoom}
          center={center}
          minZoom={8}
          maxZoom={18}
          className="map"
          dragging={true}
          onClick={this.handleMapClick}
        >
          <ZoomControl position={'bottomright'} />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={basemapUrl} // Используем URL из basemapsDict
          />
          {this.state.polygons.map(polygon => (
            <React.Fragment key={polygon.id}>
              <Polygon
                positions={polygon.coordinates}
                color={polygon.color}
                fillColor={polygon.color}
                fillOpacity={1}
              />
              <Marker
                position={this.calculatePolygonCenter(polygon.coordinates)}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="padding: 4px; border-radius: 5px; font-weight: bold; color: white; background-color: ${polygon.color};"> ${polygon.id}</div>`,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })}
              />
            </React.Fragment>
          ))}
        </Map>
        <Basemap onChange={this.changeBasemap} /> {/* Добавляем компонент Basemap */}
      </div>
    );
  }

  // Функция для вычисления центра полигона
  calculatePolygonCenter(coordinates) {
    const latSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const lngSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
    return [latSum / coordinates.length, lngSum / coordinates.length];
  }
};

const mapStateToProps = (state) => {
  return {
    layers: state.layers
  };
};

export default connect(mapStateToProps)(MapComponent);
