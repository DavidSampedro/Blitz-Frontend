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

  // ---------------- ESTADOS ----------------
  const [activeTab, setActiveTab] = useState("instituciones");
  const [loading, setLoading] = useState(true);

  const [instituciones, setInstituciones] = useState([]);
  const [miembros, setMiembros] = useState([]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    jornada: "Mañana",
    estudiantes: "",
    maps_url: ""
  });

  const [mostrarFormMiembro, setMostrarFormMiembro] = useState(false);
  const [memberData, setMemberData] = useState({ nombre: "", telefono: "" });

  const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
  const [selectedInst, setSelectedInst] = useState(null);
  const [entregaData, setEntregaData] = useState({
    cantidad: "",
    fecha: new Date().toISOString().split("T")[0]
  });

  // ---------------- CARGA DATOS ----------------
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resInst, resMemb] = await Promise.all([
        fetch(`${apiUrl}/institutions/group/${id}`),
        fetch(`${apiUrl}/members/group/${id}`)
      ]);

      if (resInst.ok) {
        const data = await resInst.json();
        setInstituciones(data || []);
      }

      if (resMemb.ok) {
        const data = await resMemb.json();
        setMiembros(data || []);
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

  // ---------------- KPI TOTALES ----------------
  const totalEstudiantes = instituciones.reduce(
    (acc, i) => acc + (Number(i.estudiantes) || 0), 0
  );

  const totalEntregas = instituciones.reduce(
    (acc, i) => acc + (Number(i.total_entregado ?? i.entregados) || 0), 0
  );

  const porcentajeAvance = totalEstudiantes > 0
    ? ((totalEntregas / totalEstudiantes) * 100).toFixed(1)
    : 0;

  // ---------------- FUNCIONES INSTITUCIONES ----------------
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarInst = () => {
    setEditId(null);
    setMostrarForm(false);
    setFormData({
      nombre: "",
      direccion: "",
      jornada: "Mañana",
      estudiantes: "",
      maps_url: ""
    });
  };

  const handleSubmitInst = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${apiUrl}/institutions/${editId}`
      : `${apiUrl}/institutions`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estudiantes: parseInt(formData.estudiantes) || 0,
          group_id: id
        })
      });

      if (res.ok) {
        handleCancelarInst();
        cargarDatos();
      }
    } catch {
      alert("Error al guardar institución");
    }
  };

  const eliminarInst = async (instId) => {
    if (!window.confirm("¿Eliminar esta institución?")) return;

    try {
      const res = await fetch(`${apiUrl}/institutions/${instId}`, {
        method: "DELETE"
      });
      if (res.ok) cargarDatos();
    } catch {
      alert("Error al eliminar");
    }
  };

  // ---------------- FUNCIONES MIEMBROS ----------------
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
    } catch {
      alert("Error al agregar miembro");
    }
  };

  const eliminarMiembro = async (mId) => {
    if (!window.confirm("¿Eliminar integrante?")) return;

    try {
      await fetch(`${apiUrl}/members/${mId}`, { method: "DELETE" });
      cargarDatos();
    } catch {
      alert("Error al eliminar");
    }
  };

  // ---------------- FUNCIONES ENTREGA ----------------
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
        setEntregaData({
          cantidad: "",
          fecha: new Date().toISOString().split("T")[0]
        });
        cargarDatos();
      }
    } catch {
      alert("Error al registrar entrega");
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-black animate-pulse uppercase tracking-widest text-xs">
            Cargando Sistema...
          </p>
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">

      {/* HEADER + KPI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/grupos")}
            className="p-3 bg-white border rounded-2xl hover:shadow-lg transition-all"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-black">Gestión de Ruta</h1>
            <p className="text-sm text-gray-500 font-semibold">
              ID Grupo: {id}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
            <UsersIcon size={22} />
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Población</p>
              <p className="text-xl font-black">{totalEstudiantes}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
            <TrendingUp size={22} />
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Entregado</p>
              <p className="text-xl font-black text-emerald-600">{totalEntregas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("instituciones")}
          className={`px-6 py-3 rounded-xl font-bold ${
            activeTab === "instituciones"
              ? "bg-white text-blue-600 shadow"
              : "text-slate-500"
          }`}
        >
          Escuelas
        </button>

        <button
          onClick={() => setActiveTab("integrantes")}
          className={`px-6 py-3 rounded-xl font-bold ${
            activeTab === "integrantes"
              ? "bg-white text-blue-600 shadow"
              : "text-slate-500"
          }`}
        >
          Equipo ({miembros.length})
        </button>
      </div>

      {/* Aquí sigue exactamente la misma lógica que ya tenías
          Tabla con semáforo profesional
          Gráfico avanzado
          Tab integrantes
          Modal entrega
      */}

    </div>
  );
}