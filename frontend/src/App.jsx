
import React, { useState } from "react";

import FarmMap from "./components/FarmMap";
import LayerControl from "./components/LayerControl";
import TerraSpectraMapPanel from "./components/TerraSpectraMapPanel";

import {
  Activity,
  Leaf,
  MapPin,
  Satellite,
  ShieldAlert,
} from "lucide-react";

import "./index.css";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>
        <Icon size={21} />
      </div>

      <h2>{value}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default function App() {
  const [layers, setLayers] = useState({
    healthy: true,
    stressed: true,
    boundary: true,
  });

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <Satellite size={30} />
          <div>
            <h2>TerraSpectra</h2>
            <span>AGRICULTURAL INTELLIGENCE</span>
          </div>
        </div>

        <nav>
          <a className="active">Overview</a>
          <a>Farm Monitoring</a>
          <a>Spectral Analysis</a>
          <a>Disease Forecast</a>
          <a>Historical Data</a>
        </nav>

        <div className="sidebar-footer">
          <Activity size={17} />
          <span>System Operational</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Crop Intelligence Dashboard</h1>
            <p>Hyperspectral Agricultural Monitoring Platform</p>
          </div>

          <div className="location">
            <MapPin size={17} />
            Indore, Madhya Pradesh
          </div>
        </header>

        <section className="stats-grid">
          <StatCard
            title="Total Farm Area"
            value="1,000 Acres"
            subtitle="Demo monitoring area"
            icon={Leaf}
          />

          <StatCard
            title="Spectral Bands"
            value="200+"
            subtitle="Hyperspectral imaging"
            icon={Satellite}
          />

          <StatCard
            title="Healthy Area"
            value="85.5%"
            subtitle="Illustrative demo metric"
            icon={Activity}
          />

          <StatCard
            title="At-Risk Area"
            value="145 Acres"
            subtitle="Illustrative demo metric"
            icon={ShieldAlert}
          />
        </section>

        <section className="map-section">
          <div className="section-heading">
            <div>
              <h2>Geospatial Farm Monitoring</h2>
              <p>
                Satellite imagery with interactive crop-condition overlays
              </p>
            </div>

            <span className="live-status">DEMO MODE</span>
          </div>

          <LayerControl
            layers={layers}
            onLayerChange={setLayers}
          />

          <div className="map-container">
            <TerraSpectraMapPanel visibility={layers} />
          </div>
        </section>

        <footer>
          TerraSpectra | Hyperspectral Crop Intelligence
          <span>Week 1 Development</span>
        </footer>
      </main>
    </div>
  );
}
