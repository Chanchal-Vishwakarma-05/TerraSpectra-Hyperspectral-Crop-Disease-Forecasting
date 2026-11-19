
import React from "react";

export default function AnalysisSummary({ analysisData }) {
  const pca = analysisData?.pca ?? {};
  const risk = analysisData?.risk ?? {};
  const metadata = analysisData?.metadata ?? {};

  const pcaCount =
    pca.component_count ?? pca.n_components;

  const pcaReady =
    pca.status === "ready" ||
    pcaCount != null ||
    Boolean(pca.preview_url);

  const riskReady =
    risk.status === "ready" ||
    risk.risk_level != null ||
    risk.at_risk_area_acres != null;

  const rawVariance = pca.explained_variance_ratio;

  const variance = Array.isArray(rawVariance)
    ? rawVariance.reduce(
        (total, value) => total + Number(value || 0),
        0
      )
    : rawVariance == null
      ? null
      : Number(rawVariance);

  const area = risk.at_risk_area_acres;

  const isSynthetic =
    metadata.is_synthetic === true ||
    metadata.data_source === "synthetic";

  return (
    <section className="ts-analysis-grid">
      <article className="ts-analysis-card">
        <div className="ts-analysis-label">
          PCA OUTPUT
        </div>

        <strong>
          {pcaReady
            ? `${pcaCount ?? "PCA"} components received`
            : "Awaiting PCA output"}
        </strong>

        <p>
          {Number.isFinite(variance)
            ? `${(variance * 100).toFixed(1)}% explained variance`
            : "No explained-variance metadata received"}
        </p>

        {pca.preview_url && (
          <img
            className="ts-analysis-preview"
            src={pca.preview_url}
            alt="PCA visualization preview"
          />
        )}
      </article>

      <article className="ts-analysis-card">
        <div className="ts-analysis-label">
          DISEASE RISK OUTPUT
        </div>

        <strong>
          {riskReady
            ? risk.risk_level ?? "Risk output received"
            : "Awaiting model output"}
        </strong>

        <p>
          {area != null && Number.isFinite(Number(area))
            ? `${Number(area).toFixed(2)} acres at risk`
            : "No affected-area estimate received"}
        </p>

        <p className="ts-analysis-validation">
          Validation status:{" "}
          {risk.validation_status ?? "Not supplied"}
        </p>

        {risk.preview_url && (
          <img
            className="ts-analysis-preview"
            src={risk.preview_url}
            alt="Disease risk visualization preview"
          />
        )}
      </article>

      <div className="ts-data-source">
        Data source:{" "}
        {!analysisData
          ? "Python pipeline not connected"
          : isSynthetic
            ? "Synthetic data"
            : metadata.data_source ?? "Pipeline payload"}
      </div>
    </section>
  );
}
