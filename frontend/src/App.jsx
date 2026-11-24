
import React, { useEffect, useState } from "react";
import { getDashboardStats } from "./services/api";
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

const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);

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
            title="Total Datasets"
            value={
              loading ? "Loading..." : stats?.total_datasets ?? 0
            }
            subtitle="Uploaded hyperspectral datasets"
            icon={Leaf}
          />

          <StatCard
            title="Processed Datasets"
            value={
              loading ? "Loading..." : stats?.processed_datasets ?? 0
            }
            subtitle="Successfully marked processed"
            icon={Satellite}
          />

          <StatCard
            title="Pending Datasets"
            value={
              loading ? "Loading..." : stats?.pending_datasets ?? 0
            }
            subtitle="Awaiting processing"
            icon={Activity}
          />

          <StatCard
            title="Total Predictions"
            value={
              loading ? "Loading..." : stats?.total_predictions ?? 0
            }
            subtitle="Model prediction records"
            icon={ShieldAlert}
          />
        </section>

        {error && (
          <div className="api-error">
            Backend connection failed: {error}
          </div>
        )}


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
