
const API_BASE_URL = "http://127.0.0.1:8000";

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);

  if (!response.ok) {
    throw new Error(`Dashboard API failed: ${response.status}`);
  }

  return response.json();
}

export async function getDatasets() {
  const response = await fetch(`${API_BASE_URL}/dataset/list`);

  if (!response.ok) {
    throw new Error(`Dataset API failed: ${response.status}`);
  }

  return response.json();
}
