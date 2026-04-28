import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { type Order } from '@/types';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OrderMapProps {
  orders: Order[];
  center?: [number, number];
  zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function OrderMap({ orders, center = [-8.0476, -34.8770], zoom = 12 }: OrderMapProps) {
  // Filter orders with valid coordinates
  const validOrders = orders.filter(o => o.lat !== undefined && o.lng !== undefined);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validOrders.map((order) => (
          <Marker 
            key={order.id} 
            position={[order.lat!, order.lng!]}
          >
            <Popup>
              <div className="p-1">
                <p className="font-black text-primary text-xs mb-1">#{order.id}</p>
                <p className="font-bold text-on-surface text-sm">{order.pointName}</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-medium mb-2">{order.region}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Volume:</span>
                  <span className="text-xs font-black text-on-surface">{order.units} unid</span>
                </div>
                <div className={cn(
                  "mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase text-center",
                  order.status === 'COMPLETED' ? "bg-green-100 text-green-700" : 
                  order.status === 'IN PROGRESS' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                )}>
                  {order.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
