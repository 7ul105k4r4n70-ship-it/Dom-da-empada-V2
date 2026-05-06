import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GMAPS_KEY_EXPORT = 'AIzaSyB4flFRII0fZonPaeiCGvHIyIOCqdgCnGo';

interface DriverMapProps {
  lat?: number;
  lng?: number;
  name: string;
  vehicle?: string;
}

export function DriverMap({ lat, lng, name, vehicle }: DriverMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GMAPS_KEY_EXPORT,
    id: 'gmaps-drivermap',
  });

  const center = { lat: lat || -8.0476, lng: lng || -34.877 };

  if (loadError) return (
    <div style={{ height: '100%' }} className="flex items-center justify-center bg-red-50">
      <p className="text-red-600 font-bold text-sm">Erro ao carregar Google Maps</p>
    </div>
  );
  if (!isLoaded) return (
    <div style={{ height: '100%' }} className="flex items-center justify-center bg-slate-50">
      <p className="text-on-surface-variant font-bold text-sm animate-pulse">Carregando mapa...</p>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={15}
      options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: true, gestureHandling: 'greedy' }}
    >
      {lat && lng && (
        <Marker
          position={center}
          icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          title={`${name} — ${vehicle || ''}`}
        />
      )}
    </GoogleMap>
  );
}

const GMAPS_KEY = 'AIzaSyB4flFRII0fZonPaeiCGvHIyIOCqdgCnGo';

const ICON_ORDER   = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
const ICON_DONE    = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
const ICON_TRANSIT = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
const ICON_DRIVER  = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

export interface MapOrder {
  id: string;
  short_id?: number;
  lat?: number;
  lng?: number;
  pointName?: string;
  point_name?: string;
  units?: number;
  status?: string;
  region?: string;
}

export interface MapDriver {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  vehicle?: string;
}

export interface OrderMapProps {
  orders?: MapOrder[];
  drivers?: MapDriver[];
  region?: string;
  center?: [number, number];
  heightClassName?: string;
}

const CENTER_RECIFE   = { lat: -8.0476, lng: -34.877 };
const CENTER_SALVADOR = { lat: -12.9714, lng: -38.5014 };

export function OrderMap({ orders = [], drivers = [], region = 'Recife', center: customCenter, heightClassName = 'h-[420px]' }: OrderMapProps) {
  const [selectedOrder, setSelectedOrder]   = useState<MapOrder | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<MapDriver | null>(null);
  const [shouldLoadMaps, setShouldLoadMaps] = useState(false);

  // Lazy loading: só carrega o Google Maps quando o componente está visível
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GMAPS_KEY,
    id: 'gmaps-ordermap',
    // Não carrega imediatamente - espera o usuário interagir
  });

  // Handler para iniciar carregamento sob demanda
  const handleMapInteraction = () => {
    if (!shouldLoadMaps) {
      setShouldLoadMaps(true);
    }
  };

  const defaultCenter = region === 'Salvador' ? CENTER_SALVADOR : CENTER_RECIFE;
  const center = customCenter || defaultCenter;

  const validOrders  = orders.filter(o  => o.lat  != null && o.lng  != null);
  const validDrivers = drivers.filter(d => d.lat  != null && d.lng  != null);

  if (loadError) return (
    <div className={`${heightClassName} flex items-center justify-center bg-red-50 rounded-2xl border border-red-100`}>
      <p className="text-red-600 font-bold text-sm">Erro ao carregar Google Maps</p>
    </div>
  );

  if (!isLoaded) return (
    <div className={`${heightClassName} flex items-center justify-center bg-slate-50 rounded-2xl`}>
      <p className="text-on-surface-variant font-bold text-sm animate-pulse">Carregando Google Maps...</p>
    </div>
  );

  return (
    <div className={`${heightClassName} w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: true, gestureHandling: 'greedy' }}
      >
        {/* ── Pedidos / Franqueados ── */}
        {validOrders.map(order => (
          <Marker
            key={`order-${order.id}`}
            position={{ lat: order.lat!, lng: order.lng! }}
            icon={order.status === 'COMPLETED' ? ICON_DONE : order.status === 'EM ANDAMENTO' ? ICON_TRANSIT : ICON_ORDER}
            title={`Pedido #${order.short_id || order.id}`}
            onClick={() => { setSelectedOrder(order); setSelectedDriver(null); }}
          />
        ))}

        {/* ── Motoristas ── */}
        {validDrivers.map(driver => (
          <Marker
            key={`driver-${driver.id}`}
            position={{ lat: driver.lat!, lng: driver.lng! }}
            icon={ICON_DRIVER}
            title={driver.name}
            onClick={() => { setSelectedDriver(driver); setSelectedOrder(null); }}
          />
        ))}

        {/* InfoWindow — Pedido */}
        {selectedOrder && (
          <InfoWindow
            position={{ lat: selectedOrder.lat!, lng: selectedOrder.lng! }}
            onCloseClick={() => setSelectedOrder(null)}
          >
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 900, color: '#b8011f', fontSize: 11, marginBottom: 4 }}>
                Pedido #{selectedOrder.short_id || selectedOrder.id}
              </p>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                {selectedOrder.pointName || selectedOrder.point_name}
              </p>
              <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                {selectedOrder.region}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                <span style={{ color: '#64748b', fontWeight: 700 }}>Volume:</span>
                <span style={{ fontWeight: 900 }}>{selectedOrder.units} unid</span>
              </div>
              <div style={{ marginTop: 6, padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 900,
                textAlign: 'center', textTransform: 'uppercase',
                background: selectedOrder.status === 'COMPLETED' ? '#dcfce7' : selectedOrder.status === 'EM ANDAMENTO' ? '#fef9c3' : '#dbeafe',
                color: selectedOrder.status === 'COMPLETED' ? '#15803d' : selectedOrder.status === 'EM ANDAMENTO' ? '#a16207' : '#1d4ed8'
              }}>
                {selectedOrder.status}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow — Motorista */}
        {selectedDriver && (
          <InfoWindow
            position={{ lat: selectedDriver.lat!, lng: selectedDriver.lng! }}
            onCloseClick={() => setSelectedDriver(null)}
          >
            <div style={{ minWidth: 140 }}>
              <p style={{ fontWeight: 900, color: '#1d4ed8', fontSize: 11, marginBottom: 4 }}>🚚 Motorista</p>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{selectedDriver.name}</p>
              <p style={{ fontSize: 10, color: '#64748b' }}>{selectedDriver.vehicle || 'Veículo não informado'}</p>
              <div style={{ marginTop: 6, padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 900,
                textAlign: 'center', background: '#dcfce7', color: '#15803d' }}>
                ATIVO
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
