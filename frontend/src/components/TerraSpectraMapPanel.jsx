
import React, { useState } from "react";

import FarmMap from "./FarmMap";
import LayerControl from "./LayerControl";
import SpectralBandSelector from "./SpectralBandSelector";
import AnalysisSummary from "./AnalysisSummary";

import "./TerraSpectraMapPanel.css";

const INITIAL_LAYERS = {
  healthy: true,
  stressed: true,
  boundary: true,
};

export default function TerraSpectraMapPanel({
  analysisData = null,
}) {
  const [visibleLayers, setVisibleLayers] =
    useState(INITIAL_LAYERS);

  const [selectedBand, setSelectedBand] =
    useState(1);

  const metadata = analysisData?.metadata ?? {};

  const bandCount = Math.max(
    1,
    Number(metadata.band_count ?? metadata.bands ?? 200)
  );

  const wavelengthsNm =
    Array.isArray(metadata.wavelengths_nm)
      ? metadata.wavelengths_nm
      : [];

  const isSynthetic =
    !analysisData ||
    metadata.is_synthetic === true ||
    metadata.data_source === "synthetic";

  return (
    <section className="ts-workspace">
      <header className="ts-workspace-header">
        <div>
          <span className="ts-workspace-kicker">
            GEOSPATIAL INTELLIGENCE
          </span>

          <h2>Farm Intelligence Workspace</h2>

          <p>
            Hyperspectral visualization and crop
            analysis controls
          </p>
        </div>

        <span className="ts-demo-badge">
          {isSynthetic
            ? "SYNTHETIC DEMO"
            : "PIPELINE DATA"}
        </span>
      </header>

      <div className="ts-workspace-grid">
        <div className="ts-workspace-main">
          <FarmMap
            visibleLayers={visibleLayers}
            analysisData={analysisData}
          />

          <AnalysisSummary
            analysisData={analysisData}
          />
        </div>

        <aside className="ts-workspace-sidebar">
          <LayerControl
            value={visibleLayers}
            onChange={setVisibleLayers}
          />

          <SpectralBandSelector
            value={selectedBand}
            bandCount={bandCount}
            wavelengthsNm={wavelengthsNm}
            onChange={setSelectedBand}
          />
        </aside>
      </div>

      <p className="ts-workspace-disclaimer">
        Demo geometry and synthetic data are for
        interface testing only. They are not validated
        crop disease detections or forecasts. Spectral
        band selection is currently a UI control;
        actual spectral imagery will be connected
        through the Python API.
      </p>
    </section>
  );
}
