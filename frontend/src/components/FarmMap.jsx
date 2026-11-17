
import React, { useMemo } from "react";
import Map from "react-map-gl/mapbox";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Approximate demonstration farm near Indore.
// These coordinates are illustrative, not surveyed boundaries.
const farmBoundary = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "TerraSpectra Demo Farm",
        acreage: 1000,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8500, 22.7200],
          [75.8650, 22.7200],
          [75.8650, 22.7300],
          [75.8500, 22.7300],
          [75.8500, 22.7200],
        ]],
      },
    },
  ],
};

// Synthetic healthy crop region
const healthyRegion = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { condition: "Healthy" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8510, 22.7210],
          [75.8580, 22.7210],
          [75.8580, 22.7280],
          [75.8510, 22.7280],
          [75.8510, 22.7210],
        ]],
      },
    },
  ],
};

// Synthetic crop-stress region
const stressedRegion = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { condition: "Crop Stress" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8590, 22.7220],
          [75.8640, 22.7220],
          [75.8640, 22.7270],
          [75.8590, 22.7270],
          [75.8590, 22.7220],
        ]],
      },
    },
  ],
};

const initialViewState = {
  longitude: 75.8575,
  latitude: 22.7250,
  zoom: 14,
  pitch: 35,
  bearing: 0,
};

export default function FarmMap({ visibility }) {
  const layers = useMemo(() => {
    const mapLayers = [];

    // Farm boundary
    if (visibility.boundary) {
      mapLayers.push(
        new GeoJsonLayer({
          id: "farm-boundary",
          data: farmBoundary,
          filled: true,
          stroked: true,
          getFillColor: [56, 189, 248, 15],
          getLineColor: [56, 189, 248, 255],
          getLineWidth: 4,
          lineWidthMinPixels: 2,
          pickable: true,
        })
      );
    }

    // Healthy crop overlay
    if (visibility.healthy) {
      mapLayers.push(
        new GeoJsonLayer({
          id: "healthy-crops",
          data: healthyRegion,
          filled: true,
          stroked: true,
          getFillColor: [34, 197, 94, 110],
          getLineColor: [34, 197, 94, 255],
          getLineWidth: 2,
          lineWidthMinPixels: 1,
          pickable: true,
        })
      );
    }

    // Crop stress overlay
    if (visibility.stressed) {
      mapLayers.push(
        new GeoJsonLayer({
          id: "stressed-crops",
          data: stressedRegion,
          filled: true,
          stroked: true,
          getFillColor: [245, 158, 11, 150],
          getLineColor: [245, 158, 11, 255],
          getLineWidth: 2,
          lineWidthMinPixels: 1,
          pickable: true,
        })
      );
    }

    return mapLayers;
  }, [visibility]);

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
