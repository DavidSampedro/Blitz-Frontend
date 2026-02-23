/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

/*function App() {
  return (
    <div className="bg-blue-500 text-white p-10 text-center">
      <h1 className="text-4xl font-bold">¡Tailwind está funcionando! 🚀</h1>
    </div>
  )
}
export default App*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Importaciones de tus componentes reales
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Grupos from "./components/Grupos";
import Instituciones from "./components/Instituciones";
import MapaRealTime from "./components/MapaRealTime";

// 2. Componentes temporales (los crearemos en sus propios archivos más adelante)
//const Mapa = () => <div className="p-10 text-2xl font-bold text-gray-700">🗺️ Módulo de Mapa Interactivo en construcción...</div>;
const Reportes = () => <div className="p-10 text-2xl font-bold text-gray-700">📄 Módulo de Reportes PDF en construcción...</div>;

function App() {
  return (
  <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
    {/* La Sidebar ahora ocupa su espacio real */}
    <Sidebar /> 

    {/* El contenido principal ocupa el resto del ancho */}
    <main className="flex-1 h-full overflow-y-auto">
      <Routes>
            {/* Rutas de navegación */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/grupos/:id" element={<Instituciones />} /> 
            <Route path="/mapa" element={<MapaRealTime />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;