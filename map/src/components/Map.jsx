import React from "react";
import L from 'leaflet';
import { Map, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl,
  VideoOverlay } from "react-leaflet";
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
    basemap: 'osm',
  };

  onBMChange = (bm) => {
    this.setState({
      basemap: bm
    });
  }

  render() {
    // console.log(this.props);
    const layersTypes = {
      'geojson': GeojsonLayer,
      'velocityLayer': VelocityLayer,
      'videoOverlay': VideoOverlay
    }
    let center = [this.state.lat, this.state.lng];

    const basemapsDict = {
      osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
    }

    const bounds = [
      [46.5, 40.9], // Юго-западная точка (примерные координаты Цилины)
      [46.6, 41.2]   // Северо-восточная точка (примерные координаты Цилины)
    ];

    return (
        <Map
          zoomControl={false}
          zoom={this.state.zoom}
          center={center}
          minZoom={8} // Минимальный зум, чтобы позволить приближение
          maxZoom={18} // Максимальный зум для детального просмотра
          bounds={bounds} // Устанавливаем границы карты
          className="map"
          maxBounds={bounds} // Ограничиваем перемещение за пределы области
          maxBoundsVisibilty={true} // Включаем видимость границ
          dragging={true} // Разрешаем перетаскивание карты
        >
            
          <ZoomControl position={'bottomright'} />
          
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={basemapsDict[this.state.basemap]}
          />
          <Basemap basemap={this.state.basemap} onChange={this.onBMChange} />

          {this.props.layers.map( l => {
            if (l.visible) {
              let LayerComp = layersTypes[l.type];
              return (
                <LayerComp key={l.id} {...l.options}/>
              )
            }
          })}

        
          <Marker position={center}>
            <Popup><div>Выбрана тема {this.state.basemap}</div></Popup>
          </Marker>
        </Map>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    layers: state.layers
  };
};

export default connect(mapStateToProps)(MapComponent);