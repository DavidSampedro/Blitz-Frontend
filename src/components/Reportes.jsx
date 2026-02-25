import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Cell 
} from 'recharts';
import { 
  FileText, Download, Users, School, Target, 
  Calendar, LayoutDashboard, ClipboardCheck, TrendingUp
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reportes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. CARGA DE DATOS DESDE EL BACKEND
  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      // Usamos el endpoint global que definimos basándonos en tu controlador
      const res = await fetch(`${apiUrl}/reports/global`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error cargando analítica:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);


// ... dentro del componente Reportes ...

if (loading) return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="font-black text-indigo-900 animate-pulse uppercase tracking-widest text-sm">Cargando Datos...</p>
  </div>
);

// --- ESTA ES LA PARTE CLAVE ---
// Si hubo un error 404 o el servidor no respondió, data será null.
// Debemos validar esto ANTES de intentar leer data.summary
if (!data || !data.summary) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold text-red-500">Error: No se pudieron cargar los reportes</h2>
      <p className="text-slate-500">Verifica que el servidor esté encendido y la ruta /api/reports/global exista.</p>
      <button 
        onClick={cargarEstadisticas} 
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Reintentar
      </button>
    </div>
  );
}

// Si llegamos aquí, data existe y es seguro desestructurar
const { summary, dailyTrend, groupPerformance } = data;


  // 2. FUNCIÓN DE EXPORTACIÓN A PDF (LÓGICA EJECUTIVA)
  const generarPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const fechaActual = new Date().toLocaleDateString();

    // Estilos de cabecera
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("REPORTE EJECUTIVO BLITZ 2026", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado el: ${fechaActual}`, 20, 32);

    // Cuadro de Resumen (KPIs)
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 40, 170, 30, 3, 3, "F");
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("TOTAL ENTREGADO", 30, 50);
    doc.text("META OBJETIVO", 80, 50);
    doc.text("AVANCE %", 145, 50);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.setFont("helvetica", "bold");
    doc.text(data.summary.total_entregado.toLocaleString(), 30, 60);
    doc.text(data.summary.meta_estudiantes.toLocaleString(), 80, 60);
    doc.text(`${((data.summary.total_entregado / data.summary.meta_estudiantes) * 100).toFixed(1)}%`, 145, 60);

    // Tabla de Grupos
    const rows = data.groupPerformance.map(g => [
      g.nombre, 
      Number(g.total_entregado).toLocaleString(),
      `${((g.total_entregado / data.summary.total_entregado) * 100).toFixed(1)}%`
    ]);

    doc.autoTable({
      startY: 80,
      head: [['Grupo / Equipo', 'Cantidad Entregada', '% de Contribución']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 }
    });

    // Pie de página con firmas
    const finalY = doc.lastAutoTable.finalY + 35;
    doc.line(30, finalY, 80, finalY);
    doc.text("Firma Coordinación", 40, finalY + 5);
    doc.line(130, finalY, 180, finalY);
    doc.text("Sello de Operaciones", 140, finalY + 5);

    doc.save(`Reporte_Blitz_${fechaActual.replace(/\//g, '-')}.pdf`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-indigo-900 animate-pulse uppercase tracking-widest text-sm">Procesando Inteligencia de Datos...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-10 bg-[#F8FAFC] min-h-screen font-sans selection:bg-indigo-100">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live System</span>
            <span className="text-slate-400 text-sm font-bold">Blitz 2026 / Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Estadísticas Globales</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={cargarEstadisticas}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Calendar size={20} className="text-slate-600" />
          </button>
          <button 
            onClick={generarPDF}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <Download size={20} />
            <span>EXPORTAR PDF</span>
          </button>
        </div>
      </div>

      {/* TARJETAS KPI (Basadas en tu SQL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Escuelas" val={data.summary.total_instituciones} icon={School} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Meta Global" val={data.summary.meta_estudiantes} icon={Target} color="text-indigo-600" bg="bg-indigo-50" />
        <KpiCard label="Entregados" val={data.summary.total_entregado} icon={ClipboardCheck} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Avance" val={`${((data.summary.total_entregado / data.summary.meta_estudiantes) * 100).toFixed(1)}%`} icon={TrendingUp} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* GRÁFICO DE TENDENCIA (AreaChart) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Flujo de Entregas</h3>
            <span className="text-xs font-bold text-slate-400">Últimos registros</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyTrend}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RENDIMIENTO POR EQUIPO (BarChart Vertical) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Ranking por Grupo</h3>
            <Users size={20} className="text-slate-300" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.groupPerformance} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: '800'}} width={120} />
                <Tooltip cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="total_entregado" radius={[0, 12, 12, 0]} barSize={25}>
                  {data.groupPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-900 p-8 rounded-[2.5rem] text-white gap-6 shadow-2xl shadow-indigo-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl"><Users size={24}/></div>
          <div>
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Voluntarios Activos</p>
            <p className="text-2xl font-black">{data.summary.total_voluntarios}</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-indigo-200 text-xs font-bold mb-1 italic">"Impactando comunidades paso a paso"</p>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-tighter">Blitz System v2.0 © 2026</p>
        </div>
      </div>
    </div>
  );
}

// SUB-COMPONENTES PARA LIMPIEZA VISUAL
function KpiCard({ label, val, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-5">
        <div className={`${bg} ${color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={26} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-800">{val.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
        <p className="text-white font-black text-xs mb-1 uppercase tracking-widest">{payload[0].payload.fecha}</p>
        <p className="text-indigo-400 font-bold text-lg">{payload[0].value} <span className="text-[10px] text-slate-500 italic">Entregas</span></p>
      </div>
    );
  }
  return null;
}