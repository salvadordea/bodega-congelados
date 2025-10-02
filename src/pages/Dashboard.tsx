import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { TrendingUp, Package, DollarSign, AlertCircle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const { spaces, reservations, clients } = useApp();

  // Calculate statistics
  const totalSpaces = spaces.length;
  const occupiedSpaces = spaces.filter((s) => s.status === 'reserved' || s.status === 'expiring-soon').length;
  const availableSpaces = spaces.filter((s) => s.status === 'available').length;
  const expiringSpaces = spaces.filter((s) => s.status === 'expiring-soon').length;
  const occupancyRate = ((occupiedSpaces / totalSpaces) * 100).toFixed(1);

  // Calculate monthly revenue
  const currentMonth = new Date();
  const monthlyReservations = reservations.filter((r) => {
    const resMonth = new Date(r.startDate).getMonth();
    const currentMonthNum = currentMonth.getMonth();
    return resMonth === currentMonthNum && r.status === 'active';
  });
  const monthlyRevenue = monthlyReservations.reduce((sum, r) => sum + r.total, 0);


  // Occupancy by section
  const sectionData = [
    {
      name: 'Sección A',
      ocupados: spaces.filter((s) => s.section === 'A' && s.status !== 'available').length,
      disponibles: spaces.filter((s) => s.section === 'A' && s.status === 'available').length,
    },
    {
      name: 'Sección B',
      ocupados: spaces.filter((s) => s.section === 'B' && s.status !== 'available').length,
      disponibles: spaces.filter((s) => s.section === 'B' && s.status === 'available').length,
    },
    {
      name: 'Sección C',
      ocupados: spaces.filter((s) => s.section === 'C' && s.status !== 'available').length,
      disponibles: spaces.filter((s) => s.section === 'C' && s.status === 'available').length,
    },
    {
      name: 'Sección D',
      ocupados: spaces.filter((s) => s.section === 'D' && s.status !== 'available').length,
      disponibles: spaces.filter((s) => s.section === 'D' && s.status === 'available').length,
    },
  ];

  // Occupancy distribution pie chart
  const pieData = [
    { name: 'Ocupados', value: occupiedSpaces, color: '#0284c7' },
    { name: 'Disponibles', value: availableSpaces, color: '#10b981' },
  ];

  // Top clients by space usage
  const clientSpaceCount = new Map<string, number>();
  reservations
    .filter((r) => r.status === 'active')
    .forEach((r) => {
      const current = clientSpaceCount.get(r.clientId) || 0;
      clientSpaceCount.set(r.clientId, current + r.spaceIds.length);
    });

  const topClients = Array.from(clientSpaceCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([clientId, count]) => {
      const client = clients.find((c) => c.id === clientId);
      return { name: client?.name || 'Unknown', spaces: count };
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general de la bodega de congelados</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-ice-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupación</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{occupancyRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {occupiedSpaces} de {totalSpaces} espacios
                </p>
              </div>
              <div className="bg-ice-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-ice-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Espacios Disponibles</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{availableSpaces}</p>
                <p className="text-sm text-gray-500 mt-1">Listos para rentar</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  ${monthlyRevenue.toLocaleString('es-MX')}
                </p>
                <p className="text-sm text-gray-500 mt-1">{monthlyReservations.length} reservaciones</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximos a Vencer</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{expiringSpaces}</p>
                <p className="text-sm text-gray-500 mt-1">Espacios (≤7 días)</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy by Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Sección</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ocupados" fill="#0284c7" name="Ocupados" />
                <Bar dataKey="disponibles" fill="#10b981" name="Disponibles" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Espacios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }: any) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top 5 Clientes por Espacios Rentados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-ice-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-ice-100 px-4 py-1 rounded-full">
                    <span className="text-ice-800 font-semibold">{client.spaces} espacios</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
