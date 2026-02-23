import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Eye } from "lucide-react"; // Añadimos Eye
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Estado para el modal/formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", lider: "" });

  // 1. Cargar Grupos (Read)
  const cargarGrupos = async () => {
    try {
      const token = localStorage.getItem("token") || "TU_TOKEN_TEMPORAL_AQUI"; // Recuerda cambiar esto cuando el Login esté listo
      const res = await fetch(`${apiUrl}/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGrupos(data);
      }
    } catch (error) {
      console.error("Error al cargar grupos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  // 2. Crear Grupo (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // Ojo: Si campaign_id es obligatorio en tu BD, deberás enviarlo aquí también
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMostrarFormulario(false);
        setFormData({ nombre: "", lider: "" });
        cargarGrupos(); // Recargar la tabla
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // 3. Eliminar Grupo (Delete)
  const eliminarGrupo = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este grupo? Se borrarán sus miembros e instituciones asociadas.")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/groups${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) cargarGrupos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-blue-600">Cargando módulos...</div>;

  return (
    <div className="p-8 space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Grupos</h1>
          <p className="text-gray-500">Administra los grupos del Blitz</p>
        </div>
        <button 
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Nuevo Grupo
        </button>
      </div>

      {/* Formulario (Modal Simple) */}
      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-4">Registrar Nuevo Grupo</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Líder a cargo</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.lider}
                onChange={(e) => setFormData({...formData, lider: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMostrarFormulario(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Datos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Líder</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grupos.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">No hay grupos registrados. Crea el primero.</td>
              </tr>
            ) : (
              grupos.map((grupo) => (
                <tr key={grupo.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={18}/></div>
                    <span className="font-medium text-gray-800">{grupo.nombre}</span>
                  </td>
                  <td className="p-4 text-gray-600">{grupo.lider || "Sin asignar"}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/grupos/${grupo.id}`)} 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                      title="Ver Instituciones"
                    >
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => eliminarGrupo(grupo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}