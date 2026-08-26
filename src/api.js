const API_BASE_URL = 'http://localhost:8000'; // Adjust port to match FastAPI backend

export const createBooking = async (data) => {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
};

export const predictDemand = async (data) => {
  const res = await fetch(`${API_BASE_URL}/predict_demand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
};

export const fetchWorkers = async () => {
  const res = await fetch(`${API_BASE_URL}/workers`);
  if (!res.ok) throw new Error('Network error');
  return res.json();
};
