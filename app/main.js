import React from 'react'
import ReactDOM from 'react-dom'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import 'fetch'

const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'

var get = function(which) {
  let url = `http://localhost:3000/data/${which}.json`
  return fetch(url).then(response => response.json())
}

function getColor(d) {
  return d === 'CDA' ? '#258f78' :
    d === 'VVD' ? '#0066ee' :
    d === 'PvdA' ? '#e40006' :
    d === 'SGP' ? '#eeaa00' :
    d === 'CPN' ? '#dd3355' :
    '#FFEDA0';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.grootste),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.6
  };
}

export default class Main extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  
  componentDidMount() {
    get('nlgis_1982+TK1982').then((data) => {
      this.setState({ data: data })
    })
  }
  
  render() {
    let zoom = 8
    let position = [ 52.1589302, 5.3077833 ]
    let height = '650px'
    return (
      <Map center={position} zoom={zoom} style={{height: height}}>
        <TileLayer
          url='http://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
          attribution={attribution}
        />
        <GeoJSON data={this.state.data} style={style} />
      </Map>
    )
  }
}

ReactDOM.render( <Main />, document.getElementById('app') )
