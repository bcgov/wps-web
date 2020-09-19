import React from 'react'
import { useSelector } from 'react-redux'

import { Station } from 'api/stationAPI'
import { selectStations } from 'app/rootReducer'
import { ErrorMessage } from 'components/ErrorMessage'
import WxStationsMap from './WxStationsMap'

interface Props {
  className?: string
  onStationsChange: (stations: React.SetStateAction<Station[]>) => void
}

const WxStationSelectMap: React.FunctionComponent<Props> = (props: Props) => {
  const { stationsGeoJSON, error } = useSelector(selectStations)

  return (
    <div className={props.className}>
      {error && <ErrorMessage error={error} context="while fetching weather stations" />}

      <WxStationsMap
        stationsGeoJSON={stationsGeoJSON}
        onStationsChange={props.onStationsChange}
      />
    </div>
  )
}

export default React.memo(WxStationSelectMap)
