import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { matchWorkers } from '../api';

const center = { lat: 22.5726, lng: 88.3639 };

export default function MapSearch() {
  const [service, setService] = useState('Electrical');
  const [position, setPosition] = useState(center);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchWorkers = async () => {
    setLoading(true);
    try {
      const result = await matchWorkers(service, position.lat, position.lng);
      setMatches(result.matches || []);
    } catch (error) {
      console.error('Worker search failed:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setPosition({ lat: coords.latitude, lng: coords.longitude }),
      () => alert('Unable to access your location.')
    );
  };

  return (
    <div>
      <div className="map-controls">
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option>Electrical</option>
          <option>Plumbing</option>
          <option>Carpentry</option>
          <option>Cleaner</option>
        </select>

        <button className="secondary-btn" onClick={useMyLocation}>
          Use my location
        </button>

        <button className="primary-btn" onClick={searchWorkers} disabled={loading}>
          {loading ? 'SEARCHING...' : 'SEARCH WORKERS'}
        </button>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '520px', borderRadius: '18px' }}
          center={position}
          zoom={12}
        >
          <Marker position={position} label="You" />

          {matches.map((worker) => (
            <Marker
              key={worker.worker_id}
              position={{ lat: worker.lat, lng: worker.lon }}
              onClick={() => setSelected(worker)}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lon }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <strong>{selected.name}</strong>
                <div>Rating: ★ {selected.rating}</div>
                <div>Distance: {selected.distance_km} km</div>
                <div>Match: {selected.match_score}%</div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}