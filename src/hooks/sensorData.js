import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase'; // Import the initialized db

export function useSensorData() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the root of your database
    const sensorDataRef = ref(db, '/');

    // onValue returns an unsubscribe function
    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensorData(snapshot.val());
      } else {
        setSensorData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read failed: ", error);
      setLoading(false);
    });

    // Cleanup function: This is called when the component that uses the hook unmounts
    return () => unsubscribe();
  }, []); // Empty array ensures this effect runs only once

  // Return the data and loading state
  return { sensorData, loading };
}
