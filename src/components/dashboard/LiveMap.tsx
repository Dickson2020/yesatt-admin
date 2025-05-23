
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';

const LiveMap: React.FC = () => {
  const { stats } = useDashboard();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    // Skip if no active bookings or map is already initialized
    if (!stats?.activeBookings?.length || mapInitialized) return;
    
    const loadMap = async () => {
      try {
        // We need to make sure Leaflet is available in the window object
        if (!window.L) {
          console.error('Leaflet is not loaded. Make sure to include the Leaflet script and CSS.');
          return;
        }

        const L = window.L;
        
        // Initialize map only if it hasn't been already
        if (mapRef.current && !mapInitialized) {
          const mapOptions = {
            center: [17.385044, 78.486671],
            zoom: 12
          };
          
          // Create map instance
          const map = L.map(mapRef.current, mapOptions);
          
          // Add tile layer (OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Custom icon for markers
          const customIcon = L.icon({
            iconUrl: 'car.png', // Make sure this image is available in your public folder
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          });
          
          // Add markers for active bookings
          stats.activeBookings.forEach((booking: any) => {
            if (booking.from_latitude && booking.from_longitude) {
              L.marker(
                [parseFloat(booking.from_latitude), parseFloat(booking.from_longitude)], 
                { icon: customIcon }
              )
              .addTo(map)
              .bindPopup(`Booking: ${booking.booking_code || 'N/A'}`);
            }
          });
          
          // Set map bounds to fit all markers
          if (stats.activeBookings.length > 0) {
            const latlngs = stats.activeBookings
              .filter((booking: any) => booking.from_latitude && booking.from_longitude)
              .map((booking: any) => [
                parseFloat(booking.from_latitude), 
                parseFloat(booking.from_longitude)
              ]);
            
            if (latlngs.length > 0) {
              map.fitBounds(L.latLngBounds(latlngs));
            }
          }
          
          setMapInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    loadMap();
    
    // Cleanup function
    return () => {
      if (mapRef.current && mapInitialized && window.L) {
        // @ts-ignore - we know map exists on mapRef.current because we set it above
        const map = mapRef.current._leaflet_map;
        if (map) map.remove();
        setMapInitialized(false);
      }
    };
  }, [stats?.activeBookings, mapInitialized]);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Map</CardTitle>
      </CardHeader>
      <CardContent className="relative p-0 h-[300px]">
        <div 
          ref={mapRef} 
          className="h-full w-full rounded-b-lg"
          style={{ minHeight: '300px' }}
        />
      </CardContent>
    </Card>
  );
};

export default LiveMap;
