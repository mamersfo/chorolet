import L from 'leaflet'
import { PropTypes } from 'react'
import { MapControl } from 'react-leaflet'

export default class Info extends MapControl {

  constructor(props) {
    super(props)
    this.state = {
      title: 'Title'
    }
  }

  componentWillMount() {
    let innerHTML = `<h4>${this.props.title}</h4>`
    this.leafletElement = L.control(this.props)
    this.leafletElement.onAdd = function(map) {
      let div = L.DomUtil.create('div', 'info')
      div.innerHTML += innerHTML
      return div
    }
  }
}
