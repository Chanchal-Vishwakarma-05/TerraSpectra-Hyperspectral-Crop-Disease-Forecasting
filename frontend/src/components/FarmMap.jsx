
import { useMemo } from "react";

import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import Map from "react-map-gl/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";
import "./FarmMap.css";

const INITIAL_VIEW_STATE = {
  longitude: 75.8575,
  latitude: 22.725,
  zoom: 14,
  pitch: 0,
  bearing: 0,
};

// Illustrative farm boundary, not surveyed field geometry.
const DEMO_BOUNDARY = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Demo Farm" },
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

// Illustrative healthy crop regions.
const DEMO_HEALTHY = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { class: "healthy" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8510, 22.7210],
          [75.8570, 22.7210],
          [75.8570, 22.7280],
          [75.8510, 22.7280],
          [75.8510, 22.7210],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { class: "healthy" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8630, 22.7210],
          [75.8645, 22.7210],
          [75.8645, 22.7290],
          [75.8630, 22.7290],
          [75.8630, 22.7210],
        ]],
      },
    },
  ],
};

// Illustrative chemically stressed crop region.
const DEMO_STRESSED = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { class: "stressed" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.8580, 22.7230],
          [75.8625, 22.7230],
          [75.8625, 22.7275],
          [75.8580, 22.7275],
          [75.8580, 22.7230],
        ]],
      },
    },
  ],
};

function getFeatureCollection(value, fallback) {
  return value?.type === "FeatureCollection"
    ? value
    : fallback;
}

export default function FarmMap({
  visibleLayers = {},
  analysisData = null,
}) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Real backend GeoJSON takes precedence over demo data.
  const pipelineLayers = analysisData?.layers ?? {};

  const boundaryData = getFeatureCollection(
    pipelineLayers.boundary,
    DEMO_BOUNDARY
  );

  const healthyData = getFeatureCollection(
    pipelineLayers.healthy,
    DEMO_HEALTHY
  );

  const stressedData = getFeatureCollection(
    pipelineLayers.stressed,
    DEMO_STRESSED
  );

  const showHealthy = visibleLayers.healthy !== false;
  const showStressed = visibleLayers.stressed !== false;
  const showBoundary = visibleLayers.boundary !== false;

  const deckLayers = useMemo(() => {
    const layers = [];

    if (showHealthy) {
      layers.push(
        new GeoJsonLayer({
          id: "healthy-regions",
          data: healthyData,
          pickable: false,
          stroked: true,
          filled: true,
          getFillColor: [34, 197, 94, 75],
          getLineColor: [34, 197, 94, 200],
          getLineWidth: 2,
          lineWidthMinPixels: 1,
        })
      );
    }

    if (showStressed) {
      layers.push(
        new GeoJsonLayer({
          id: "stressed-regions",
          data: stressedData,
          pickable: false,
          stroked: true,
          filled: true,
          getFillColor: [245, 158, 11, 110],
          getLineColor: [245, 158, 11, 230],
          getLineWidth: 2,
          lineWidthMinPixels: 1,
        })
      );
    }

    if (showBoundary) {
      layers.push(
        new GeoJsonLayer({
          id: "farm-boundary",
          data: boundaryData,
          pickable: false,
          stroked: true,
          filled: false,
          getLineColor: [56, 189, 248, 255],
          getLineWidth: 3,
          lineWidthMinPixels: 2,
        })
      );
    }

    return layers;
  }, [
    healthyData,
    stressedData,
    boundaryData,
    showHealthy,
    showStressed,
    showBoundary,
  ]);

  const suppliedCount = [
    "healthy",
    "stressed",
    "boundary",
  ].filter(
    (key) =>
      pipelineLayers[key]?.type === "FeatureCollection"
  ).length;

  const isSynthetic =
    analysisData?.metadata?.is_synthetic === true ||
    analysisData?.metadata?.data_source === "synthetic";

  const sourceLabel =
    suppliedCount === 0
      ? "Illustrative demo overlays"
      : isSynthetic
        ? "Synthetic pipeline GeoJSON"
        : suppliedCount === 3
          ? "Pipeline GeoJSON"
          : "Mixed pipeline and demo layers";

  if (!mapboxToken) {
    return (
      <div className="farm-map farm-map--missing-token">
        <div>
          <h3>Mapbox token required</h3>
          <p>
            Add VITE_MAPBOX_TOKEN to frontend/.env
            and restart Vite.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="farm-map">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={deckLayers}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          style={{ width: "100%", height: "100%" }}
        />
      </DeckGL>

      <div className="farm-map__source">
        {sourceLabel}
      </div>
    </div>
  );
}
