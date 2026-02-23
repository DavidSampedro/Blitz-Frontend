import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Building, Plus, MapPin, Users as UsersIcon, 
  Save, X, Edit, Trash2, Phone, UserPlus, MessageCircle, Truck
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend
} from 'recharts';
const apiUrl = import.meta.env.VITE_API_URL;

export default function Instituciones() {
  const { id } = useParams(); // ID del Grupo
  const navigate = useNavigate();
  
  // --- ESTADOS GLOBALES ---
  const [activeTab, setActiveTab] = useState("instituciones");
  const [loading, setLoading] = useState(true);

  // --- ESTADOS: INSTITUCIONES ---
  const [instituciones, setInstituciones] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "", direccion: "", jornada: "Mañana", estudiantes: "", maps_url: ""
  });

  // --- ESTADOS: MIEMBROS ---
  const [miembros, setMiembros] = useState([]);
  const [mostrarFormMiembro, setMostrarFormMiembro] = useState(false);
  const [memberData, setMemberData] = useState({ nombre: "", telefono: "" });

  // --- ESTADOS: ENTREGAS (Deliveries) ---
  const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
  const [selectedInst, setSelectedInst] = useState(null);
  const [entregaData, setEntregaData] = useState({ 
    cantidad: "", 
    fecha: new Date().toISOString().split('T')[0] 
  });

  // --- CARGA DE DATOS ---
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resInst, resMemb] = await Promise.all([
        fetch(`${apiUrl}/institutions/group/${id}`),
        fetch(`${apiUrl}/members/group/${id}`)
      ]);
      
      if (resInst.ok) {
        const dataInst = await resInst.json();
        setInstituciones(dataInst || []);
      }
      if (resMemb.ok) {
        const dataMemb = await resMemb.json();
        setMiembros(dataMemb || []);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  // --- FUNCIONES: INSTITUCIONES ---
  const handleEditInst = (inst) => {
    setEditId(inst.id);
    setFormData({
      nombre: inst.nombre || "",
      direccion: inst.direccion || "",
      jornada: inst.jornada || "Mañana",
      estudiantes: inst.estudiantes || "",
      maps_url: inst.maps_url || ""
    });
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarInst = () => {
    setMostrarForm(false);
    setEditId(null);
    setFormData({ nombre: "", direccion: "", jornada: "Mañana", estudiantes: "", maps_url: "" });
  };

  const handleSubmitInst = async (e) => {
    e.preventDefault();
    const url = editId ? `${apiUrl}/institutions/${editId}` : `${apiUrl}/institutions`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          group_id: id, 
          estudiantes: parseInt(formData.estudiantes) || 0 
        })
      });
      if (res.ok) {
        handleCancelarInst();
        cargarDatos();
      }
    } catch (error) { alert("Error al guardar institución"); }
  };

  const eliminarInst = async (instId) => {
    if (!window.confirm("¿Eliminar esta institución? Se borrarán también sus entregas.")) return;
    try {
      const res = await fetch(`${apiUrl}/institutions/${instId}`, { method: "DELETE" });
      if (res.ok) cargarDatos();
    } catch (error) { alert("Error al eliminar"); }
  };

  // --- FUNCIONES: MIEMBROS ---
  const handleSubmitMiembro = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberData, group_id: id })
      });
      if (res.ok) {
        setMemberData({ nombre: "", telefono: "" });
        setMostrarFormMiembro(false);
        cargarDatos();
      }
    } catch (error) { alert("Error al agregar miembro"); }
  };

  const eliminarMiembro = async (mId) => {
    if (!window.confirm("¿Eliminar a este integrante?")) return;
    try {
      await fetch(`${apiUrl}/members/${mId}`, { method: "DELETE" });
      cargarDatos();
    } catch (error) { alert("Error al eliminar"); }
  };

  // --- FUNCIONES: ENTREGAS ---
  const handleOpenEntrega = (inst) => {
    setSelectedInst(inst);
    setMostrarFormEntrega(true);
  };

  const handleSubmitEntrega = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/deliveries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cantidad: parseInt(entregaData.cantidad),
          fecha: entregaData.fecha,
          institution_id: selectedInst.id,
          group_id: id
        })
      });

      if (res.ok) {
        setMostrarFormEntrega(false);
        setEntregaData({ cantidad: "", fecha: new Date().toISOString().split('T')[0] });
        cargarDatos(); 
      }
    } catch (error) {
      alert("Error al registrar la entrega");
    }
  };

  // --- RENDER CONDICIONAL SI ESTÁ CARGANDO ---
  if (loading) return <div className="p-8 text-blue-600 font-bold animate-pulse text-center">Cargando datos...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/grupos")} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Panel de Gestión</h1>
          <p className="text-gray-500 font-medium">Configura las rutas y el equipo</p>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex p-1.5 bg-gray-200/60 rounded-2xl w-fit backdrop-blur-sm overflow-x-auto">
        <button 
          onClick={() => setActiveTab("instituciones")}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "instituciones" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Building size={20} /> Instituciones
        </button>
        <button 
          onClick={() => setActiveTab("integrantes")}
          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "integrantes" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
        >
          <UsersIcon size={20} /> Integrantes ({miembros.length})
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* =========================================
          TAB 1: INSTITUCIONES
      ========================================= */}
      {activeTab === "instituciones" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* GRÁFICO (Solo si hay datos) */}
          {instituciones.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-6 tracking-widest">
                Progreso de Entregas por Institución
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={instituciones} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} width={120} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="estudiantes" name="Población Total" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={15} />
                    <Bar dataKey="entregados" name="Entregados" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* CABECERA DE TABLA */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">Listado de Escuelas</h2>
            <button 
              onClick={() => (mostrarForm ? handleCancelarInst() : setMostrarForm(true))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${mostrarForm ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"}`}
            >
              {mostrarForm ? <X size={20}/> : <Plus size={20}/>}
              <span className="hidden sm:inline">{mostrarForm ? "Cancelar" : "Añadir Institución"}</span>
            </button>
          </div>

          {/* FORMULARIO INSTITUCIÓN */}
          {mostrarForm && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Edit className="text-blue-600" size={20}/> {editId ? "Editar Institución" : "Nueva Institución"}
              </h3>
              <form onSubmit={handleSubmitInst} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-1">Nombre</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-1">Dirección</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-1">Jornada</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 outline-none"
                      value={formData.jornada} onChange={(e) => setFormData({...formData, jornada: e.target.value})}>
                      <option value="Mañana">Matutina</option>
                      <option value="Tarde">Vespertina</option>
                      <option value="Noche">Nocturna</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-1">Población</label>
                    <input type="number" required className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.estudiantes} onChange={(e) => setFormData({...formData, estudiantes: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-red-400 uppercase mb-1">Google Maps Link</label>
                    <input type="url" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-red-400"
                      value={formData.maps_url} onChange={(e) => setFormData({...formData, maps_url: e.target.value})} />
                  </div>
                  <button type="submit" className="bg-green-600 text-white px-4 rounded-xl font-bold h-[46px] hover:bg-green-700 transition-all">
                    <Save size={20}/>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TABLA DE INSTITUCIONES */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="p-4 font-bold text-gray-400 text-xs uppercase">Institución</th>
                  <th className="p-4 font-bold text-gray-400 text-xs uppercase text-center">Población</th>
                  <th className="p-4 font-bold text-gray-400 text-xs uppercase text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {instituciones.map((inst) => {
                  const entregados = parseInt(inst.entregados) || 0;
                  const estudiantes = parseInt(inst.estudiantes) || 0;
                  const isCompletado = entregados >= estudiantes && estudiantes > 0;
                  const tieneEntregasParciales = entregados > 0 && !isCompletado;

                  return (
                    <tr key={inst.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                      <td className="p-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                          {inst.nombre}
                          {inst.maps_url && (
                            <a href={inst.maps_url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600" title="Ver en Maps">
                              <MapPin size={16} />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{inst.jornada} • {inst.direccion || "Sin dirección"}</div>
                      </td>
                      
                      {/* CÉLULA DE POBLACIÓN (SEMÁFORO) */}
                      <td className="p-4 text-center">
                        <div className="relative group inline-block">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all duration-300 shadow-sm cursor-help ${
                            isCompletado 
                              ? "bg-green-500 text-white border-green-600 ring-4 ring-green-100" 
                              : tieneEntregasParciales
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}>
                            {estudiantes}
                          </span>
                          
                          {/* Tooltip Hover */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-10">
                            Entregados: {entregados} / {estudiantes}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEntrega(inst)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all" title="Registrar Entrega">
                            <Truck size={18} />
                          </button>
                          <button onClick={() => handleEditInst(inst)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Editar">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => eliminarInst(inst.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {instituciones.length === 0 && (
                  <tr><td colSpan="3" className="p-8 text-center text-gray-400">No hay instituciones registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: INTEGRANTES
      ========================================= */}
      {activeTab === "integrantes" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">Equipo del Grupo</h2>
            <button 
              onClick={() => setMostrarFormMiembro(!mostrarFormMiembro)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {mostrarFormMiembro ? <X size={20}/> : <UserPlus size={20}/>}
              <span className="hidden sm:inline">{mostrarFormMiembro ? "Cancelar" : "Nuevo Integrante"}</span>
            </button>
          </div>

          {mostrarFormMiembro && (
            <form onSubmit={handleSubmitMiembro} className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-black text-indigo-400 uppercase mb-1">Nombre Completo</label>
                <input required type="text" className="w-full p-3 rounded-xl border-none ring-1 ring-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={memberData.nombre} onChange={e => setMemberData({...memberData, nombre: e.target.value})} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-black text-indigo-400 uppercase mb-1">Teléfono</label>
                <input type="text" className="w-full p-3 rounded-xl border-none ring-1 ring-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={memberData.telefono} onChange={e => setMemberData({...memberData, telefono: e.target.value})} />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">Añadir</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {miembros.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-100">
                  {m.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{m.nombre}</h3>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 font-medium">
                    <Phone size={12} className="text-indigo-300" /> {m.telefono || "Sin número"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {m.telefono && (
                    <a href={`https://wa.me/${m.telefono.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors" title="WhatsApp">
                      <MessageCircle size={20} />
                    </a>
                  )}
                  <button onClick={() => eliminarMiembro(m.id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {miembros.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200">
                <UsersIcon size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium text-sm">No hay integrantes en este grupo.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE ENTREGAS (OVERLAY FIXED)
      ========================================= */}
      {mostrarFormEntrega && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">Nueva Entrega</h2>
              <button onClick={() => setMostrarFormEntrega(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              Institución: <span className="font-bold text-indigo-700">{selectedInst?.nombre}</span>
            </p>

            <form onSubmit={handleSubmitEntrega} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Cantidad Entregada</label>
                <input 
                  required type="number" min="1"
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 50"
                  value={entregaData.cantidad}
                  onChange={e => setEntregaData({...entregaData, cantidad: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Fecha</label>
                <input 
                  required type="date" 
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl p-4 text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={entregaData.fecha}
                  onChange={e => setEntregaData({...entregaData, fecha: e.target.value})}
                />
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 text-white mt-2 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                <Truck size={20} /> Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}