import { LayoutDashboard, Users, Map, FileText, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/" },
    { name: "Grupos e Inst.", icon: <Users />, path: "/grupos" },
    { name: "Mapa Real-Time", icon: <Map />, path: "/mapa" },
    { name: "Reportes PDF", icon: <FileText />, path: "/reportes" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <span className="bg-blue-700 text-white p-1 rounded">B</span> Blitz
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-700 font-bold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}