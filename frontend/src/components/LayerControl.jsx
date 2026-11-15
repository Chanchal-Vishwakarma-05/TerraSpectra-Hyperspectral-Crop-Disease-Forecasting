
import React, { useState } from "react";
import "./LayerControl.css";

const initialLayers = {
  healthy: true,
  stressed: true,
  boundary: true,
};

const layerOptions = [
  {
    id: "healthy",
    label: "Healthy Crops",
    color: "#22c55e",
    description: "Healthy vegetation regions",
  },
  {
    id: "stressed",
    label: "Crop Stress",
    color: "#f59e0b",
    description: "Chemically stressed regions",
  },
  {
    id: "boundary",
    label: "Farm Boundary",
    color: "#38bdf8",
    description: "Farm geographical boundary",
  },
];

export default function LayerControl({ onLayerChange }) {
  const [layers, setLayers] = useState(initialLayers);

  const toggleLayer = (id) => {
    setLayers((previous) => {
      const updated = {
        ...previous,
        [id]: !previous[id],
      };

      onLayerChange?.(updated);
      return updated;
    });
  };

  return (
    <section className="layer-control">
      <div className="layer-header">
        <div>
          <h3>Map Layers</h3>
          <p>Control map visibility</p>
        </div>
        <span className="layer-count">
          {Object.values(layers).filter(Boolean).length}/3
        </span>
      </div>

      <div className="layer-list">
        {layerOptions.map((layer) => (
          <button
            key={layer.id}
            type="button"
            className={`layer-item ${
              layers[layer.id] ? "active" : ""
            }`}
            onClick={() => toggleLayer(layer.id)}
            aria-pressed={layers[layer.id]}
          >
            <span
              className="layer-dot"
              style={{ backgroundColor: layer.color }}
            />

            <span className="layer-info">
              <strong>{layer.label}</strong>
              <small>{layer.description}</small>
            </span>

            <span className="layer-status">
              {layers[layer.id] ? "ON" : "OFF"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
