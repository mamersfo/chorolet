import L from 'leaflet'
import { PropTypes } from 'react'
import { MapControl } from 'react-leaflet'

export default class Legend extends MapControl {

  constructor(props) {
    super(props)
    this.state = {
      colors: {}
    }
  }

  componentWillMount() {
    let innerHTML = Object.keys(this.props.colors).map((key) => {
      return `<i style=\"background: ${this.props.colors[key]}\"></i>&nbsp;${key}`
    }).join('<br/>')

    this.leafletElement = L.control(this.props)

    this.leafletElement.onAdd = function(map) {
      let div = L.DomUtil.create('div', 'info legend')
      div.innerHTML += innerHTML
      return div
    }
  }
}
