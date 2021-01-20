export default function getMapPoint (mapviewer, visoglobeID) {
  if (mapviewer) {
    const { getPlace, getPOI } = mapviewer

    if (getPlace(visoglobeID)) {
      return { type: 'place',
        point: getPlace(visoglobeID) }
    }
    if (getPOI(visoglobeID)) {
      return { type: 'POI',
        point: getPOI(visoglobeID) }
    }
    return null
  } else {
    throw Error('Mapviewer is undefined')
  }
}
