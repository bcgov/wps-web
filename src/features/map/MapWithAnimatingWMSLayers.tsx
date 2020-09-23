import React, { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import Stop from '@material-ui/icons/Stop'

import { topoLayer } from 'features/map/mapLayers'

const useStyles = makeStyles({
  map: {
    height: '450px'
  }
})

/* Async function used to retrieve start and end time from RADAR_1KM_RRAI layer GetCapabilities document */
async function getRadarStartEndTime(): Promise<[Date, Date]> {
  const parser = new DOMParser()
  const response = await fetch(
    'https://geo.weather.gc.ca/geomet/?lang=en&service=WMS&request=GetCapabilities&version=1.3.0&LAYERS=RADAR_1KM_RRAI'
  )
  const data = await response.text().then(data =>
    parser
      .parseFromString(data, 'text/xml')
      .getElementsByTagName('Dimension')[0]
      .innerHTML.split('/')
  )
  return [new Date(data[0]), new Date(data[1])]
}

let animationId: number | null = null
const radarLayer = L.tileLayer.wms('https://geo.weather.gc.ca/geomet?TILED=true&', {
  layers: 'RADAR_1KM_RRAI', // RADAR - Radar precipitation rate (Rain) (1 km) [mm/hr]
  version: '1.3.0',
  opacity: 0.5,
  transparent: true,
  format: 'image/png'
})
const radarCoverageLayer = L.tileLayer.wms('https://geo.weather.gc.ca/geomet?', {
  layers: 'RADAR_COVERAGE_RRAI.INV', // Dynamic radar coverage - inverted (Rain) (1km)
  version: '1.3.0',
  opacity: 0.5,
  transparent: true,
  format: 'image/png'
})

const MapWithAnimatingWMSLayers: React.FunctionComponent = () => {
  const classes = useStyles()
  const mapRef = useRef<L.Map | null>(null)
  const [radarStartEndTime, setRadarStartEndTime] = useState<[Date, Date] | null>(null)
  const [radarCurrTime, setRadarCurrTime] = useState<Date | null>(null)

  /* Create a Leaflet map with a layers control */
  useEffect(() => {
    mapRef.current = L.map('map-with-animating-wms-layers', {
      center: [49.1, -123.6],
      zoom: 5,
      zoomAnimation: true,
      layers: [topoLayer, radarLayer, radarCoverageLayer]
    })

    // Destroy the map and clear all related event listeners when the component unmounts
    return () => {
      mapRef.current?.remove()
      animationId && window.clearInterval(animationId)
    }
  }, []) // Initialize the map only once

  useEffect(() => {
    getRadarStartEndTime().then(data => {
      setRadarStartEndTime(data)
    })
  }, [setRadarStartEndTime])

  useEffect(() => {
    let url = 'https://geo.weather.gc.ca/geomet?TILED=true&'
    if (radarCurrTime) {
      const TIME = radarCurrTime?.toISOString().split('.')[0] + 'Z'
      url = url + `TIME=${TIME}`
    }
    radarLayer.setUrl(url)
  }, [radarCurrTime])

  const handlePlay = () => {
    if (radarStartEndTime) {
      const [radarStartTime, radarEndTime] = radarStartEndTime
      animationId = window.setInterval(() => {
        setRadarCurrTime(curr => {
          if (curr === null) {
            return radarStartTime
          } else if (curr >= radarEndTime) {
            return radarStartTime
          } else {
            const bar = new Date(curr)
            bar.setMinutes(bar.getMinutes() + 10)
            return bar
          }
        })
      }, 2500)
    }
  }

  const handlePause = () => {
    if (animationId) {
      window.clearInterval(animationId)
      animationId = null
    }
  }

  const handleStop = () => {
    setRadarCurrTime(null)

    if (animationId) {
      window.clearInterval(animationId)
      animationId = null
    }
  }

  return (
    <>
      <div id="map-with-animating-wms-layers" className={classes.map} />
      <IconButton onClick={handlePlay}>
        <PlayArrow color="primary" fontSize="large" />
      </IconButton>
      <IconButton onClick={handlePause}>
        <Pause color="primary" fontSize="large" />
      </IconButton>
      <IconButton onClick={handleStop}>
        <Stop color="primary" fontSize="large" />
      </IconButton>
      {radarCurrTime && <span>Time (UTC): {`${radarCurrTime}`}</span>}
    </>
  )
}

export default React.memo(MapWithAnimatingWMSLayers)
