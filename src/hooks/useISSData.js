import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const EARTH_RADIUS_KM = 6371;
const POLL_INTERVAL = 15000; // 15 seconds
const MAX_TRAJECTORY = 15;
const MAX_SPEED_HISTORY = 30;

// Use Vercel Serverless (prod) or Vite Proxy (dev) to bypass CORS and Mixed Content issues
const ISS_API = '/api/iss-now';
const ASTROS_API = '/api/astros';

/**
 * Haversine formula to calculate the distance between two coordinates.
 * Returns distance in kilometers.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}

export function useISSData() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [trajectory, setTrajectory] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const previousPosition = useRef(null);
  const previousTimestamp = useRef(null);

  // Fetch current ISS position
  const fetchISSPosition = useCallback(async () => {
    try {
      const response = await axios.get(ISS_API);
      const { latitude, longitude } = response.data.iss_position;
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const now = Date.now();

      setPosition({ latitude: lat, longitude: lng });
      setTimestamp(response.data.timestamp);

      // Calculate speed using Haversine formula
      if (previousPosition.current && previousTimestamp.current) {
        const prevLat = previousPosition.current.latitude;
        const prevLng = previousPosition.current.longitude;
        const timeDiffSeconds = (now - previousTimestamp.current) / 1000;

        if (timeDiffSeconds > 0) {
          const distance = haversineDistance(prevLat, prevLng, lat, lng);
          const speedKmH = (distance / timeDiffSeconds) * 3600;

          // Clamp speed to a reasonable ISS range (0-40000 km/h)
          const clampedSpeed = Math.min(Math.max(speedKmH, 0), 40000);
          setCurrentSpeed(Math.round(clampedSpeed));

          setSpeedHistory((prev) => {
            const updated = [...prev, { time: new Date().toLocaleTimeString(), speed: Math.round(clampedSpeed) }];
            return updated.slice(-MAX_SPEED_HISTORY);
          });
        }
      }

      // Update trajectory
      setTrajectory((prev) => {
        const updated = [...prev, [lat, lng]];
        return updated.slice(-MAX_TRAJECTORY);
      });

      // Store for next calculation
      previousPosition.current = { latitude: lat, longitude: lng };
      previousTimestamp.current = now;
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch ISS position:', err);
      setError('Failed to fetch ISS position');
      setLoading(false);
    }
  }, []);

  // Fetch astronauts
  const fetchAstronauts = useCallback(async () => {
    try {
      const response = await axios.get(ASTROS_API);
      setAstronauts(response.data.people || []);
    } catch (err) {
      console.error('Failed to fetch astronauts:', err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchISSPosition();
    fetchAstronauts();

    // Poll every 15 seconds
    const interval = setInterval(fetchISSPosition, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchISSPosition, fetchAstronauts]);

  return {
    position,
    trajectory,
    speedHistory,
    currentSpeed,
    astronauts,
    loading,
    error,
    timestamp,
  };
}
