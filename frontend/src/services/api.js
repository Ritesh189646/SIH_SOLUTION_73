import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== ''
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const apiService = {
  // General & Health
  async getHealth() {
    const res = await api.get('/health');
    return res.data;
  },

  async getRoot() {
    const res = await api.get('/');
    return res.data;
  },

  // Pipeline Execution & Data Upload
  async runAnalysis() {
    const res = await api.post('/analysis/run');
    return res.data;
  },

  async uploadData(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Analytics & Results
  async getStats() {
    const res = await api.get('/stats');
    return res.data;
  },

  async getAnomalyResults(scenarioId = null) {
    const url = scenarioId !== null ? `/anomaly/results?scenario_id=${scenarioId}` : '/anomaly/results';
    const res = await api.get(url);
    return res.data;
  },

  async getClassificationResults(scenarioId = null) {
    const url = scenarioId !== null ? `/classification/results?scenario_id=${scenarioId}` : '/classification/results';
    const res = await api.get(url);
    return res.data;
  },

  async getResults(scenarioId = null) {
    const url = scenarioId !== null ? `/results?scenario_id=${scenarioId}` : '/results';
    const res = await api.get(url);
    return res.data;
  },

  // Scenarios
  async getScenarios() {
    const res = await api.get('/scenarios');
    return res.data;
  },

  async getScenario(scenarioId) {
    const res = await api.get(`/scenarios/${scenarioId}`);
    return res.data;
  }
};

export default apiService;
