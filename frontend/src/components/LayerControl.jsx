
import React from "react";
import "./LayerControl.css";

const DEFAULT_LAYERS = {
  healthy: true,
  stressed: true,
  boundary: true,
};

const LAYER_OPTIONS = [
  {
    id: "healthy",
    label: "Healthy Vegetation",
    description: "Healthy crop regions",
  },
  {
    id: "stressed",
    label: "Chemical Stress",
    description: "Chemically stressed regions",
  },
  {
    id: "boundary",
    label: "Farm Boundary",
    description: "Geographical farm perimeter",
  },
];

export default function LayerControl({
  value = DEFAULT_LAYERS,
  onChange,
}) {
  const layers = {
    ...DEFAULT_LAYERS,
    ...value,
  };

  const activeCount = Object.values(layers).filter(Boolean).length;

  const toggleLayer = (id) => {
    onChange?.({
      ...layers,
      [id]: !layers[id],
    });
  };

  return (
    <section className="ts-layer-panel">
      <div className="ts-layer-heading">
        <div>
          <h3>Map Layers</h3>
          <p>Control geospatial visibility</p>
        </div>

        <span className="ts-layer-count">
          {activeCount}/3
        </span>
      </div>

      <div className="ts-layer-list">
        {LAYER_OPTIONS.map((layer) => (
          <label
            key={layer.id}
            className={`ts-layer-row ${
              layers[layer.id] ? "active" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(layers[layer.id])}
              onChange={() => toggleLayer(layer.id)}
            />

            <span
              className={`ts-layer-swatch ${layer.id}`}
            />

            <span className="ts-layer-info">
              <strong>{layer.label}</strong>
              <small>{layer.description}</small>
            </span>

            <span className="ts-layer-state">
              {layers[layer.id] ? "ON" : "OFF"}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
