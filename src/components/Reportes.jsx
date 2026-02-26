import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Cell 
} from 'recharts';
import { 
  Download, Users, School, Target, 
  Calendar, ClipboardCheck, TrendingUp
} from "lucide-react";
// 🚨 CORRECCIÓN CLAVE PARA EL PDF: Importar con llaves
import { jsPDF } from "jspdf"; 
import "jspdf-autotable";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reportes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
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

  // 🚨 LÓGICA DE PDF CORREGIDA Y ROBUSTA
  const generarPDF = () => {
    try {
      if (!data || !data.summary) {
        alert("Aún no hay datos cargados para exportar.");
        return;
      }

      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString();

      // Variables base
      const totalEntregado = Number(data.summary.total_entregado) || 0;
      const metaGlobal = Number(data.summary.meta_estudiantes) || 40000;
      const avanceGlobal = ((totalEntregado / metaGlobal) * 100).toFixed(1);

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
      doc.text(totalEntregado.toLocaleString(), 30, 60);
      doc.text(metaGlobal.toLocaleString(), 80, 60);
      doc.text(`${avanceGlobal}%`, 145, 60);

      // Preparar datos para la tabla
      const rows = data.groupPerformance.map(g => {
        const aportado = Number(g.total_entregado) || 0;
        // Evitar división por cero si totalEntregado es 0
        const contribucion = totalEntregado > 0 ? ((aportado / totalEntregado) * 100).toFixed(1) : "0.0";
        
        return [
          g.nombre, 
          aportado.toLocaleString(),
          `${contribucion}%`
        ];
      });

      // Insertar Tabla
      doc.autoTable({
        startY: 80,
        head: [['Grupo / Equipo', 'Cantidad Entregada', '% del Total General']],
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

      // Descargar archivo
      doc.save(`Reporte_Blitz_${fechaActual.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
      console.error("Error crítico al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola (F12) para más detalles.");
    }
  };

  // --- ESTADOS DE CARGA Y ERROR ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-indigo-900 animate-pulse uppercase tracking-widest text-sm">Procesando Inteligencia de Datos...</p>
    </div>
  );

  if (!data || !data.summary) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-screen bg-slate-50">
        <h2 className="text-2xl font-black text-red-500 mb-2">Error de conexión</h2>
        <p className="text-slate-500 mb-6">No se pudieron cargar los datos del servidor. Verifica que el Backend esté activo.</p>
        <button 
          onClick={cargarEstadisticas} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  // Cálculos limpios para las tarjetas
  const metaGlobal = Number(data.summary.meta_estudiantes) || 40000;
  const totalEntregado = Number(data.summary.total_entregado) || 0;
  const avancePorcentaje = metaGlobal > 0 ? ((totalEntregado / metaGlobal) * 100).toFixed(1) : 0;

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
          
          {/* BOTÓN DE PDF AHORA ENLAZADO Y PROTEGIDO */}
          <button 
            onClick={generarPDF}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 cursor-pointer"
          >
            <Download size={20} />
            <span>EXPORTAR PDF</span>
          </button>
        </div>
      </div>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Escuelas" val={data.summary.total_instituciones} icon={School} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Meta Global" val={metaGlobal} icon={Target} color="text-indigo-600" bg="bg-indigo-50" />
        <KpiCard label="Entregados" val={totalEntregado} icon={ClipboardCheck} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Avance" val={`${avancePorcentaje}%`} icon={TrendingUp} color="text-amber-600" bg="bg-amber-50" />
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
          <p className="text-indigo-200 text-xs font-bold mb-1 italic">"El Evangelio es nuestra MISIÓN"</p>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-tighter">Blitz System v2.0 © 2026</p>
        </div>
      </div>
    </div>
  );
}

// SUB-COMPONENTES 
function KpiCard({ label, val, icon: Icon, color, bg }) {
  // Aseguramos que siempre haya un valor para mostrar
  const displayVal = val !== undefined && val !== null ? val : 0;
  
  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-5">
        <div className={`${bg} ${color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={26} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-800">
            {typeof displayVal === 'number' ? displayVal.toLocaleString() : displayVal}
          </p>
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