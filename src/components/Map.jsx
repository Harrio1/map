import React from "react";
import L from 'leaflet';
import { Map, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl,
  VideoOverlay,
  Polygon } from "react-leaflet";
import Basemap from './Basemaps';
import GeojsonLayer from '../layers/GeojsonLayerFunc';
import VelocityLayer from "../layers/VelocityLayer";
import '../css/Map.css';
import { connect } from "react-redux";

// указываем путь к файлам marker
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

class MapComponent extends React.Component {
  state = {
    // Установите координаты для Целинского района Ростовской области
    lat: 46.536032,  // Широта
    lng: 41.031736, // Долгота
    zoom: 10,     // Увеличение для более детального просмотра
    basemap: 'mapbox', // Убедитесь, что это значение существует в basemapsDict
    polygons: [], // Массив для хранения заливок
    inputCoordinates: [], // Массив для хранения введенных координат
  };

  // Переместите basemapsDict сюда
  basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    mapbox: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.png"
  };

  handleInputChange = (e) => {
    const { value } = e.target;
    const coordinates = value.split(',').map(coord => coord.trim()).filter(coord => coord); // Разделяем по запятой и очищаем пробелы
    this.setState({ inputCoordinates: coordinates });
  };

  addPolygon = () => {
    if (this.state.inputCoordinates.length === 4) {
      const coordinates = this.state.inputCoordinates.map(coord => {
        const [lat, lng] = coord.split(' ').map(Number); // Преобразуем строку в массив чисел
        return [lat, lng];
      });

      const newPolygon = {
        id: this.state.polygons.length + 1, // Нумерация заливки
        coordinates: coordinates
      };

      this.setState(prevState => ({
        polygons: [...prevState.polygons, newPolygon],
        inputCoordinates: [] // Очистка поля ввода
      }));
      console.log("Polygon added:", newPolygon);
    } else {
      alert("Введите 4 координаты в формате 'lat lng', разделенные запятыми.");
    }
  };

  handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newCoordinates = [...this.state.inputCoordinates, `${lat} ${lng}`]; // Добавляем координаты в формате 'lat lng'
    this.setState({
      inputCoordinates: newCoordinates
    });
  };

  render() {
    const center = [this.state.lat, this.state.lng];
    const basemapUrl = this.basemapsDict[this.state.basemap];

    if (!basemapUrl) {
      console.error('Basemap URL is undefined');
      return null;
    }

    console.log("Current Polygons:", this.state.polygons); // Выводим текущие полигоны в консоль

    return (
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
          <input
            type="text"
            placeholder='Введите координаты в формате "lat lng", разделенные запятыми'
            value={this.state.inputCoordinates.join(', ')} // Преобразуем массив в строку
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
            url={basemapUrl}
          />
          {this.state.polygons.map(polygon => (
            <Polygon
              key={polygon.id}
              positions={polygon.coordinates}
              color='blue'
              fillColor='rgba(0, 0, 255, 0.5)'
              fillOpacity={0.5}
            />
          ))}
          <Marker position={center}>
            <Popup><div>Выбрана тема {this.state.basemap}</div></Popup>
          </Marker>
        </Map>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    layers: state.layers
  };
};

export default connect(mapStateToProps)(MapComponent);
