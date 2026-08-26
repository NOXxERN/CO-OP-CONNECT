const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://co-op-connect-backend.onrender.com';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status}: ${message || response.statusText}`);
  }

  return response.json();
};

export const createBooking = (data) =>
  request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const predictDemand = (data) =>
  request('/api/admin/predict-demand', {
    method: 'POST',
    body: JSON.stringify({
      service_type: data.service_category,
      region: data.location,
      days_ahead: 1,
    }),
  });

export const fetchWorkers = () => request('/api/workers');

export const matchWorkers = (service, lat, lon) =>
  request('/api/match', {
    method: 'POST',
    body: JSON.stringify({
      service,
      customer_lat: lat,
      customer_lon: lon,
    }),
  });

export const fetchStats = () => request('/api/admin/stats');
