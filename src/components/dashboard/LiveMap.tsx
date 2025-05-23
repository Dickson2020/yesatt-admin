
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { Booking } from '@/types';
import { Loader } from 'lucide-react';

interface MapProps {
  bookings: Booking[];
}

// This component will load Leaflet dynamically when rendered
const MapComponent: React.FC<MapProps> = ({ bookings }) => {
  useEffect(() => {
    // Create a script element for Leaflet CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    linkElement.crossOrigin = '';
    document.head.appendChild(linkElement);

    // Create a script element for Leaflet JS
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    scriptElement.crossOrigin = '';
    document.head.appendChild(scriptElement);

    // Wait for Leaflet to load
    scriptElement.onload = () => {
      // Initialize the map
      const L = window.L;
      if (!L) return;
      
      const mapOptions = {
        center: [17.385044, 78.486671],
        zoom: 13
      };
      
      // Create the map
      const map = L.map('map', mapOptions);
      
      // Add the tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create custom icon
      const customIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      // Add markers for each booking
      const validBookings = bookings.filter(
        booking => booking.from_latitude && booking.from_longitude
      );

      if (validBookings.length > 0) {
        validBookings.forEach((booking) => {
          const lat = parseFloat(booking.from_latitude || '0');
          const lng = parseFloat(booking.from_longitude || '0');
          
          if (lat && lng) {
            L.marker([lat, lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`
                <strong>Booking: ${booking.booking_code}</strong><br>
                From: ${booking.place}<br>
                To: ${booking.destination_place}<br>
                Status: ${booking.status}
              `);
          }
        });

        // Center map on the first booking
        const firstBooking = validBookings[0];
        const firstLat = parseFloat(firstBooking.from_latitude || '0');
        const firstLng = parseFloat(firstBooking.from_longitude || '0');
        if (firstLat && firstLng) {
          map.setView([firstLat, firstLng], 13);
        }

        // Animate between markers
        let index = 0;
        const interval = setInterval(() => {
          const booking = validBookings[index];
          const lat = parseFloat(booking.from_latitude || '0');
          const lng = parseFloat(booking.from_longitude || '0');
          
          if (lat && lng) {
            map.panTo([lat, lng]);
          }
          
          index = (index + 1) % validBookings.length;
        }, 5000);

        // Clean up
        return () => {
          clearInterval(interval);
          map.remove();
        };
      }
    };

    // Clean up
    return () => {
      // Only remove if no other component is using Leaflet
      // This is simplified; a more robust solution would track usage
      document.head.removeChild(linkElement);
    };
  }, [bookings]);

  return <div id="map" className="h-full min-h-[300px] rounded-md"></div>;
};

const LiveMap: React.FC = () => {
  const { stats, loading } = useDashboard();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (stats?.activeBookings) {
      setActiveBookings(stats.activeBookings);
    }
  }, [stats]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Ride Tracking</span>
          <span className="text-sm font-normal text-gray-500">
            {activeBookings.length} active rides
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MapComponent bookings={activeBookings} />
        )}
      </CardContent>
    </Card>
  );
};

export default LiveMap;
