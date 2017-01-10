import React from 'react'
import ReactDOM from 'react-dom'
import { Map, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'fetch'
import Legend from './legend'
import Info from './info'

const attribution = 'Kaartgegevens &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'

const baseUrl = ""
// const baseUrl = "https://mamersfo.github.io"

var get = function(which) {
  let url = `${baseUrl}/chorolet/data/${which}.json`
  return fetch(url).then(response => response.json())
}

const legend = {
  'CDA': '#258f78',
  'PvdA': '#e40006',
  'VVD': '#0066ee',
  'SGP': '#eeaa00',
  'CPN': '#dd3355'
}

function style(feature) {
  return {
    fillColor: legend[feature.properties.grootste],
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '1',
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
    let height = '100%'
    return (
      <Map ref='map' center={position} zoom={zoom} style={{height: height}}>
        <GeoJSON data={this.state.data} style={style} />
        <Legend position='bottomright' colors={legend} />
        <Info position='topright' title='TK 1982: grootste partij per gemeente' />
      </Map>
    )
  }
}

ReactDOM.render( <Main />, document.getElementById('app') )
