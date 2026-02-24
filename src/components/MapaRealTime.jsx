/*import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function MapaRealTime() {
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/map/locations`)
      .then(res => res.json())
      .then(data => setPuntos(data));
  }, []);

  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Mapa de Entregas en Tiempo Real 📍</h1>
      <div className="h-[80%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <MapContainer center={[-1.65, -78.65]} zoom={7} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {puntos.map(p => (
            <CircleMarker 
              key={p.id}
              center={[p.latitud, p.longitud]}
              radius={9}
              pathOptions={{
                fillColor: p.estado === 'entregado' ? '#10b981' : '#ef4444',
                color: 'white',
                weight: 2,
                fillOpacity: 0.9
              }}
            >
              <Popup>
                    <div className="p-2 min-w-[150px]">
                    <h3 className="font-bold text-gray-800 border-b pb-1 mb-2">{p.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-1"><b>Grupo:</b> {p.grupo}</p>
                    <p className="text-sm mb-3">
                        <b>Estado:</b> 
                        <span className={p.estado === 'entregado' ? 'text-green-600' : 'text-red-500'}>
                        {p.estado === 'entregado' ? ' ✅ Entregado' : ' ⏳ Pendiente'}
                        </span>
                    </p>
                    
                    {/* Botón elegante para abrir el link original */
                /*}
                    <a 
                        href={p.maps_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block text-center bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ver en Google Maps →
                    </a>
                    </div>
                </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}*/
/*
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function MapaRealTime() {
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/map/locations`)
      .then(res => res.json())
      .then(data => setPuntos(data))
      .catch(err => console.error("Error cargando mapa:", err));
  }, []);

  return (
    <div className="p-6 h-screen flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Mapa Radar de Entregas 📡</h1>
        <div className="flex gap-4">
          <span className="flex items-center text-sm font-bold text-gray-600"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div> Entregados</span>
          <span className="flex items-center text-sm font-bold text-gray-600"><div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div> Pendientes</span>
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200">
        <MapContainer center={[-1.65, -78.65]} zoom={7} className="h-full w-full">
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          {puntos.map(p => (
            <CircleMarker 
              key={p.id}
              center={[p.lat, p.lng]}
              radius={9}
              pathOptions={{
                fillColor: p.estado === 'entregado' ? '#10b981' : '#ef4444',
                color: 'white',
                weight: 2,
                fillOpacity: 1
              }}
            >
              <Popup className="rounded-xl">
                <div className="p-1 min-w-[160px] font-sans">
                  <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">{p.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-1"><b>🏢 Grupo:</b> {p.grupo}</p>
                  <p className="text-sm mb-4 flex items-center gap-1">
                    <b>🚦 Estado:</b> 
                    <span className={`px-2 py-0.5 rounded-md text-white text-xs font-bold ${p.estado === 'entregado' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {p.estado === 'entregado' ? 'ENTREGADO' : 'PENDIENTE'}
                    </span>
                  </p>
                  
                  <a 
                    href={p.maps_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex justify-center items-center w-full bg-blue-600 text-white font-semibold text-xs py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    📍 Abrir en Navegador
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}*/

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function MapaRealTime() {
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/map/locations`)
      .then(res => res.json())
      .then(data => setPuntos(data))
      .catch(err => console.error("Error al cargar puntos:", err));
  }, []);

  return (
    <div className="p-4 h-screen bg-gray-100 flex flex-col">
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-4 flex justify-between items-center border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">RADAR LOGÍSTICO BLITZ CUENCA📡</h1>
          <p className="text-gray-500 text-sm">Monitoreo de entregas en tiempo real</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-xs font-bold text-gray-600 uppercase">Entregado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]"></span>
            <span className="text-xs font-bold text-gray-600 uppercase">Pendiente</span>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
        <MapContainer center={[-2.90, -79.00]} zoom={10} className="h-full w-full">
          {/* Mapa base elegante estilo 'Voyager' */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          {puntos.map(p => (
            <CircleMarker 
              key={p.id}
              center={[p.lat, p.lng]} // Usa los nombres de tu BD
              radius={10}
              pathOptions={{
                fillColor: p.estado === 'entregado' ? '#10b981' : '#ef4444',
                color: 'white',
                weight: 3,
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <div className="p-2 font-sans text-center">
                  <h3 className="font-bold text-gray-900 mb-1">{p.nombre}</h3>
                  <p className="text-xs text-blue-600 font-bold mb-3 uppercase tracking-widest">{p.grupo}</p>
                  <a 
                    href={p.maps_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block bg-gray-900 text-white text-[10px] px-4 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md"
                  >
                    ABRIR RUTA EN MAPS →
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}