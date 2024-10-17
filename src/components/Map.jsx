import React from "react";
import L from 'leaflet';
import { Map, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl,
  Polygon,
  Polyline,
  } from "react-leaflet";

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
    creationMode: true, // Новый флаг для режима создания полей
    selectedPolygonId: null, // ID выбранного полигона
  };

  // Переместите basemapsDict сюда
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
        const [lat, lng] = coord.split(' ').map(Number); // Преобразуем строку в массив чисел
        return [lat, lng];
      });

      const newPolygon = {
        id: this.state.polygons.length + 1, // Нумерация заливки
        coordinates: coordinates,
        color: this.colors[this.state.polygons.length % this.colors.length] // Выбор цвета
      };

      this.setState(prevState => ({
        polygons: [...prevState.polygons, newPolygon],
        inputCoordinates: [] // Очистка поля ввода
      }));
      console.log("Polygon added:", newPolygon);
    } else {
      alert("Введите от 4 до 9 координат в формате 'lat lng', разделенные запятыми.");
    }
  };

  toggleCreationMode = () => {
    this.setState(prevState => ({
      creationMode: !prevState.creationMode
    }));
  };

  removeLastPolygon = () => {
    this.setState(prevState => ({
      polygons: prevState.polygons.slice(0, -1) // Удаляем последний полигон
    }));
  };

  handleMapClick = (e) => {
    if (!this.state.creationMode) return; // Если режим создания выключен, не добавляем координаты

    const { lat, lng } = e.latlng;
    const newCoordinates = [...this.state.inputCoordinates, `${lat} ${lng}`];
    this.setState({
      inputCoordinates: newCoordinates
    });
  };

  selectPolygon = (id) => {
    this.setState({ selectedPolygonId: id });
  };

  removeSelectedPolygon = () => {
    this.setState(prevState => ({
      polygons: prevState.polygons.filter(polygon => polygon.id !== prevState.selectedPolygonId),
      selectedPolygonId: null // Сбросить выбранный полигон
    }));
  };

  clearMarkers = () => {
    this.setState({ inputCoordinates: [] });
  };

  render() {
    const center = [this.state.lat, this.state.lng];
    const basemapUrl = this.basemapsDict[this.state.basemap];

    if (!basemapUrl) {
      console.error('Basemap URL is undefined');
      return null;
    }

    console.log("Current Polygons:", this.state.polygons); // Выводим текущие полигоны в консоль

    // Преобразуем inputCoordinates в массив координат для Polyline
    const polylineCoordinates = this.state.inputCoordinates.map(coord => {
      const [lat, lng] = coord.split(' ').map(Number);
      return [lat, lng];
    });

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
          <button onClick={this.clearMarkers}>Очистить маркеры</button>
          <button onClick={this.toggleCreationMode}>
            {this.state.creationMode ? 'Выключить режим создания' : 'Включить режим создания'}
          </button>
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
          {this.state.inputCoordinates.map((coord, index) => {
            const [lat, lng] = coord.split(' ').map(Number);
            return (
              <Marker key={index} position={[lat, lng]} />
            );
          })}
          {this.state.polygons.map(polygon => (
            <React.Fragment key={polygon.id}>
              <Polygon
                positions={polygon.coordinates}
                color={polygon.color}
                fillColor={polygon.color} // Устанавливаем цвет заливки
                fillOpacity={1} // Полностью непрозрачный
                onClick={() => this.selectPolygon(polygon.id)} // Обработчик клика для выбора полигона
              >
                <Popup>
                  <div>
                    <p>Поле {polygon.id}</p>
                    <button onClick={this.removeSelectedPolygon}>Удалить поле</button>
                  </div>
                </Popup>
              </Polygon>
              <Marker
                position={this.calculatePolygonCenter(polygon.coordinates)}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="padding: 4px; border-radius: 5px; font-weight: bold; color: white; background-color: ${polygon.color};">Поле ${polygon.id}</div>`,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })}
              />
            </React.Fragment>
          ))}
          <Polyline positions={polylineCoordinates} />
        </Map>
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
