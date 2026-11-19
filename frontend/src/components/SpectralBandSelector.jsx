
import React from "react";
import "./SpectralBandSelector.css";

export default function SpectralBandSelector({
  value = 1,
  bandCount = 200,
  wavelengthsNm = [],
  onChange,
}) {
  const count = Math.max(
    1,
    Math.floor(Number(bandCount) || 200)
  );

  const band = Math.min(
    count,
    Math.max(1, Math.round(Number(value) || 1))
  );

  const rawWavelength = wavelengthsNm?.[band - 1];

  const measuredWavelength =
    rawWavelength == null
      ? NaN
      : Number(rawWavelength);

  const hasMetadata = Number.isFinite(measuredWavelength);

  const estimatedWavelength =
    400 +
    ((band - 1) / Math.max(1, count - 1)) * 600;

  const wavelength = hasMetadata
    ? measuredWavelength
    : estimatedWavelength;

  const wavelengthLabel =
    hasMetadata || count === 200
      ? `${wavelength.toFixed(1)} nm`
      : "Wavelength unavailable";

  return (
    <section className="ts-band-panel">
      <div className="ts-band-heading">
        <div>
          <h3>Spectral Analysis</h3>
          <p>Hyperspectral band selection</p>
        </div>

        <span className="ts-band-total">
          {count} BANDS
        </span>
      </div>

      <div className="ts-band-readout">
        <div>
          <small>SELECTED BAND</small>
          <strong>{band}</strong>
        </div>

        <div>
          <small>WAVELENGTH</small>
          <strong>{wavelengthLabel}</strong>
        </div>
      </div>

      <input
        className="ts-band-slider"
        type="range"
        min="1"
        max={count}
        step="1"
        value={band}
        onChange={(event) =>
          onChange?.(Number(event.target.value))
        }
        aria-label="Select hyperspectral band"
      />

      <div className="ts-band-scale">
        <span>Band 1</span>
        <span>Band {count}</span>
      </div>

      <div className="ts-band-footer">
        {hasMetadata
          ? "Wavelength from pipeline metadata"
          : count === 200
            ? "Approximate wavelength until metadata is connected"
            : "Waiting for wavelength metadata"}
      </div>
    </section>
  );
}
