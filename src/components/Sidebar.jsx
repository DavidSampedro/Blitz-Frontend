import { useState } from "react";
import { LayoutDashboard, Users, Map, FileText, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true); // Estado para controlar el ancho
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
    { name: "Grupos e Inst.", icon: <Users size={22} />, path: "/grupos" },
    { name: "Mapa Real-Time", icon: <Map size={22} />, path: "/mapa" },
    { name: "Reportes PDF", icon: <FileText size={22} />, path: "/reportes" },
  ];

  return (
    <div 
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Botón Flotante para colapsar */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-10 bg-blue-700 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Header / Logo */}
      <div className="p-6 overflow-hidden">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
          <span className="bg-blue-700 text-white px-2 py-1 rounded min-w-[32px] text-center">TGI</span>
          {isExpanded && <span className="whitespace-nowrap">Blitz Cuenca</span>}
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-700 font-bold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="min-w-[22px]">{item.icon}</div>
            {isExpanded && <span className="whitespace-nowrap">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer / Salir */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-4 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={22} />
          {isExpanded && <span className="font-bold">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}