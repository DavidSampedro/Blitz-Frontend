import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Building, Plus, MapPin, Users as UsersIcon, 
  Save, X, Edit, Trash2, Phone, UserPlus, MessageCircle, Truck,
  CheckCircle2, AlertCircle, Clock3, TrendingUp
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Instituciones() {
  const { id } = useParams();
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

  // --- ESTADOS: ENTREGAS ---
  const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
  const [selectedInst, setSelectedInst] = useState(null);
  const [entregaData, setEntregaData] = useState({ 
    cantidad: "", fecha: new Date().toISOString().split('T')[0] 
  });

  // --- CARGA DE DATOS ---
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resInst, resMemb] = await Promise.all([
        fetch(`${apiUrl}/institutions/group/${id}`),
        fetch(`${apiUrl}/members/group/${id}`)
      ]);
      if (resInst.ok) setInstituciones(await resInst.json() || []);
      if (resMemb.ok) setMiembros(await resMemb.json() || []);
    } catch (error) { 
      console.error("Error cargando datos:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { cargarDatos(); }, [id]);

  // --- LÓGICA DE TOTALES ---
  const totalEstudiantes = instituciones.reduce((acc, i) => acc + (Number(i.estudiantes) || 0), 0);
  const totalEntregas = instituciones.reduce((acc, i) => acc + (Number(i.entregados) || 0), 0);
  const porcentajeAvance = totalEstudiantes > 0 ? ((totalEntregas / totalEstudiantes) * 100).toFixed(1) : 0;

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
        body: JSON.stringify({ ...formData, group_id: id, estudiantes: parseInt(formData.estudiantes) || 0 })
      });
      if (res.ok) { handleCancelarInst(); cargarDatos(); }
    } catch (error) { alert("Error al guardar institución"); }
  };

  const eliminarInst = async (instId) => {
    if (!window.confirm("¿Eliminar esta institución?")) return;
    try {
      const res = await fetch(`${apiUrl}/institutions/${instId}`, { method: "DELETE" });
      if (res.ok) cargarDatos();
    } catch (error) { alert("Error al eliminar"); }
  };

  // --- FUNCIONES: MIEMBROS ---
  const handleSubmitMiembro = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/members`, {
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
    if (!window.confirm("¿Eliminar integrante?")) return;
    try {
      await fetch(`${apiUrl}/members/${mId}`, { method: "DELETE" });
      cargarDatos();
    } catch (error) { alert("Error al eliminar"); }
  };

  // --- FUNCIONES: ENTREGAS ---
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
    } catch (error) { alert("Error al registrar entrega"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black animate-pulse uppercase tracking-widest text-xs">Cargando Sistema...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. HEADER Y TOTALES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate("/grupos")} className="p-3 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group">
            <ArrowLeft size={22} className="text-gray-400 group-hover:text-blue-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Ruta</h1>
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ID Grupo: {id}
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <div className="bg-white p-4 pr-10 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[180px]">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><UsersIcon size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Población</p>
              <p className="text-xl font-black text-slate-800">{totalEstudiantes}</p>
            </div>
          </div>
          <div className="bg-white p-4 pr-10 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[180px]">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><TrendingUp size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entregado</p>
              <p className="text-xl font-black text-emerald-600">{totalEntregas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit backdrop-blur-md">
        {[
          { id: "instituciones", icon: Building, label: "Escuelas" },
          { id: "integrantes", icon: UsersIcon, label: `Equipo (${miembros.length})` }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? "bg-white text-blue-600 shadow-xl" : "text-slate-500 hover:text-slate-700"}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB INSTITUCIONES ================= */}
      {activeTab === "instituciones" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-800">Listado de Instituciones</h2>
            <button 
              onClick={() => (mostrarForm ? handleCancelarInst() : setMostrarForm(true))}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all active:scale-95 ${mostrarForm ? "bg-slate-200 text-slate-600" : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200"}`}
            >
              {mostrarForm ? <X size={20}/> : <Plus size={20}/>}
              <span className="hidden sm:inline">{mostrarForm ? "Cancelar" : "Nueva Institución"}</span>
            </button>
          </div>

          {/* FORMULARIO */}
          {mostrarForm && (
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-blue-50 animate-in zoom-in-95 duration-300">
               <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Edit className="text-blue-600" size={20}/> {editId ? "Editar Registro" : "Nuevo Registro"}
              </h3>
              <form onSubmit={handleSubmitInst} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                  <input type="text" required className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección</label>
                  <input type="text" className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jornada</label>
                    <select className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.jornada} onChange={(e) => setFormData({...formData, jornada: e.target.value})}>
                      <option value="Mañana">Matutina</option>
                      <option value="Tarde">Vespertina</option>
                      <option value="Noche">Nocturna</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Población</label>
                    <input type="number" required className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.estudiantes} onChange={(e) => setFormData({...formData, estudiantes: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">Google Maps</label>
                    <input type="url" className="w-full bg-red-50/30 border-none ring-1 ring-red-100 rounded-xl p-3 focus:ring-2 focus:ring-red-400 outline-none"
                      value={formData.maps_url} onChange={(e) => setFormData({...formData, maps_url: e.target.value})} />
                  </div>
                  <button type="submit" className="bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">
                    <Save size={20}/>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TABLA CON SEMÁFORO */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Institución / Detalles</th>
                  <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Estado de Carga</th>
                  <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {instituciones.map((inst) => {
                  const ent = Number(inst.entregados) || 0;
                  const est = Number(inst.estudiantes) || 0;
                  const isCompletado = ent >= est && est > 0;
                  const isParcial = ent > 0 && ent < est;
                  
                  return (
                    <tr key={inst.id} className="group hover:bg-blue-50/30 transition-all">
                      <td className="p-6">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{inst.nombre}</span>
                          {inst.maps_url && (
                            <a href={inst.maps_url} target="_blank" rel="noreferrer" className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                              <MapPin size={14} />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md mr-2">{inst.jornada}</span>
                          {inst.direccion || "Sin dirección"}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`relative px-6 py-2 rounded-2xl font-black text-sm border-2 transition-all duration-500 flex items-center gap-3 ${
                            isCompletado ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-4 ring-emerald-500/10" 
                            : isParcial ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}>
                            {isCompletado ? <CheckCircle2 size={16} /> : isParcial ? <AlertCircle size={16} /> : <Clock3 size={16} />}
                            {est} Estudiantes
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Entregado: {ent}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button onClick={() => setSelectedInst(inst) || setMostrarFormEntrega(true)} className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <Truck size={20} />
                          </button>
                          <button onClick={() => handleEditInst(inst)} className="p-3 text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                            <Edit size={20} />
                          </button>
                          <button onClick={() => eliminarInst(inst.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GRÁFICO */}
          {instituciones.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Avance de Cobertura</h3>
                  <p className="text-slate-400 text-sm font-medium">Visualización de metas por institución</p>
                </div>
                <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl font-black text-sm">
                   Global: {porcentajeAvance}%
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={instituciones} margin={{ left: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748B' }} width={140} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="estudiantes" radius={[0, 12, 12, 0]} barSize={24}>
                      {instituciones.map((entry, index) => {
                        const ent = Number(entry.entregados) || 0;
                        const est = Number(entry.estudiantes) || 0;
                        const color = ent >= est ? "#10B981" : ent > 0 ? "#F59E0B" : "#E2E8F0";
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB EQUIPO ================= */}
      {activeTab === "integrantes" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-800">Miembros del Equipo</h2>
            <button 
              onClick={() => setMostrarFormMiembro(!mostrarFormMiembro)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {mostrarFormMiembro ? <X size={20}/> : <UserPlus size={20}/>}
              <span className="hidden sm:inline">Nuevo Miembro</span>
            </button>
          </div>

          {mostrarFormMiembro && (
            <form onSubmit={handleSubmitMiembro} className="bg-white p-6 rounded-[2rem] shadow-lg border-2 border-indigo-50 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2">
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input required type="text" className="w-full p-3 rounded-xl bg-indigo-50/30 border-none ring-1 ring-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={memberData.nombre} onChange={e => setMemberData({...memberData, nombre: e.target.value})} />
              </div>
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">WhatsApp</label>
                <input type="text" className="w-full p-3 rounded-xl bg-indigo-50/30 border-none ring-1 ring-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={memberData.telefono} onChange={e => setMemberData({...memberData, telefono: e.target.value})} />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Registrar</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miembros.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100">
                  {m.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg">{m.nombre}</h3>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-1 font-semibold uppercase tracking-tighter">
                    <Phone size={12} className="text-indigo-400" /> {m.telefono || "---"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {m.telefono && (
                    <a href={`https://wa.me/${m.telefono.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                      <MessageCircle size={22} />
                    </a>
                  )}
                  <button onClick={() => eliminarMiembro(m.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE ENTREGAS */}
      {mostrarFormEntrega && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registrar Entrega</h2>
              <button onClick={() => setMostrarFormEntrega(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Institución Destino</p>
              <p className="font-bold text-indigo-700 text-lg">{selectedInst?.nombre}</p>
            </div>

            <form onSubmit={handleSubmitEntrega} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cantidad de Soportes</label>
                <input required type="number" min="1" className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl p-4 text-xl font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={entregaData.cantidad} onChange={e => setEntregaData({...entregaData, cantidad: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Entrega</label>
                <input required type="date" className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl p-4 font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={entregaData.fecha} onChange={e => setEntregaData({...entregaData, fecha: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 shadow-2xl transition-all flex items-center justify-center gap-3">
                <Truck size={22} /> Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}