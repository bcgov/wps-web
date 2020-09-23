import React from 'react'
import { useSelector } from 'react-redux'

import { Station } from 'api/stationAPI'
import { selectStations } from 'app/rootReducer'
import MapWithRemoteWxStations from 'features/map/MapWithRemoteWxStations'

interface Props {
  className?: string
  onStationsChange: (stations: React.SetStateAction<Station[]>) => void
}

const WxStationSelectMap: React.FunctionComponent<Props> = (props: Props) => {
  const { stationsGeoJSON, error } = useSelector(selectStations)

  return (
    <div className={props.className}>
      <MapWithRemoteWxStations
        fetchStationsError={error}
        stationsGeoJSON={stationsGeoJSON}
        onStationsChange={props.onStationsChange}
      />
    </div>
  )
}

export default React.memo(WxStationSelectMap)
