
import React, { useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Approximate demo farm location near Indore
const farmBoundary = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "TerraSpectra Demo Farm",
        acreage: 1000
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8500, 22.7200],
          [75.8650, 22.7200],
          [75.8650, 22.7300],
          [75.8500, 22.7300],
          [75.8500, 22.7200]
        ]]
      }
    }
  ]
};

const initialViewState = {
  longitude: 75.8575,
  latitude: 22.7250,
  zoom: 14,
  pitch: 35,
  bearing: 0
};

export default function FarmMap() {

  const layers = useMemo(() => [
    new GeoJsonLayer({
      id: "farm-boundary",
      data: farmBoundary,
      filled: true,
      stroked: true,
      getFillColor: [34, 197, 94, 35],
      getLineColor: [34, 197, 94, 255],
      getLineWidth: 4,
      lineWidthMinPixels: 2,
      pickable: true
    })
  ], []);

  return (
    <div style={{ width: "100%", height: "100%" }}>

      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >

        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          reuseMaps
        />

      </DeckGL>

    </div>
  );
}
