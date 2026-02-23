import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { Package, Target, TrendingUp } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const GRAY_LIGHT = "#e5e7eb";

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      //const token = localStorage.getItem("token"); // Traemos el token guardado en el login
      
// PEGA ESTO (Temporalmente):
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODdiODUyLTBjNmItNDM0Ny05OTgwLTU0YTFlY2U2YWMxNSIsImlhdCI6MTc3MTYzNTgxNy...";
      //const headers = { Authorization: `Bearer ${token}` };

      try {
        const [resP, resG] = await Promise.all([
          fetch(`${apiUrl}/deliveries/progress`),
          fetch(`${apiUrl}/deliveries/groups`)
        ]);

        if (resP.ok && resG.ok) {
          setProgress(await resP.json());
          setGroups(await resG.json());
          
          setProgress(dataP);
          setGroups(dataG);
        } else {
          console.error("Respuesta de red no satisfactoria");
        }
      } catch (err) {
        console.error("Error cargando el dashboard:", err);
      }
    };
    loadData();
  }, []);

  if (!progress) return <div className="p-10 text-center font-bold text-blue-600 animate-bounce">Cargando Dashboard...</div>;

  const pieData = [
    { name: "Entregado", value: progress.entregado },
    { name: "Faltante", value: Math.max(0, progress.meta - progress.entregado) }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard Blitz 🚀</h1>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">Admin Mode</span>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Total Entregado" value={progress.entregado.toLocaleString()} icon={<Package className="text-blue-500" />} color="text-blue-600" />
        <Card title="Meta Global" value={progress.meta.toLocaleString()} icon={<Target className="text-gray-500" />} color="text-gray-700" />
        <Card title="% Avance" value={progress.porcentaje + "%"} icon={<TrendingUp className="text-green-500" />} color="text-green-600" />
      </div>

      {/* GRAFICOS */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard title="Progreso Global">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={90} paddingAngle={5}>
                  <Cell fill={COLORS[0]} />
                  <Cell fill={GRAY_LIGHT} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Entregas por Grupo">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={groups} dataKey="entregado" nameKey="grupo" outerRadius={90}>
                  {groups.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function Card({ title, value, color, icon }) {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex flex-col items-center">
      <h2 className="font-bold text-gray-700 mb-4 text-lg">{title}</h2>
      {children}
    </div>
  );
}