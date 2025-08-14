import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

// This is the return type for our refetch function.
type LocationReturnType = {
  location: Location.LocationObject | null;
  errorMsg: string | null;
};

// This is a custom hook specifically for fetching the user's current location.
export const useUserLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // We wrap the main logic in a useCallback so we can call it on demand.
  const fetchLocation = useCallback(async (): Promise<LocationReturnType> => {
    setLoading(true);
    setErrorMsg(null);
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const error = 'Permission to access location was denied.';
      setErrorMsg(error);
      setLoading(false);
      return { location: null, errorMsg: error }; // Return the error
    }

    try {
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentPosition);
      setLoading(false);
      return { location: currentPosition, errorMsg: null }; // Return the location
    } catch {
      const errorText = 'Could not fetch location. Please ensure location services are on.';
      setErrorMsg(errorText);
      setLoading(false);
      return { location: null, errorMsg: errorText }; // Return the error
    }
  }, []);

  // Run the fetch function once on initial mount.
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Expose the location data, loading state, error, and the refetch function.
  return { location, loading, errorMsg, refetchLocation: fetchLocation };
};
