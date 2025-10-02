import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Mail, Phone } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';

export const Clients: React.FC = () => {
  const { clients, reservations, addClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // New client form
  const [newClient, setNewClient] = useState({
    name: '',
    rfc: '',
    phone: '',
    email: '',
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    const client = {
      id: `c${clients.length + 1}`,
      ...newClient,
      createdAt: new Date(),
    };
    addClient(client);
    setIsAddModalOpen(false);
    setNewClient({ name: '', rfc: '', phone: '', email: '' });
  };

  const getClientReservations = (clientId: string) => {
    return reservations.filter((r) => r.clientId === clientId);
  };

  const getClientActiveReservations = (clientId: string) => {
    return reservations.filter((r) => r.clientId === clientId && r.status === 'active');
  };

  const selectedClientData = selectedClient ? clients.find((c) => c.id === selectedClient) : null;
  const selectedClientReservations = selectedClient ? getClientReservations(selectedClient) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes frecuentes</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, RFC o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ice-500 focus:border-ice-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-ice-600">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{clients.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-600">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {new Set(reservations.filter((r) => r.status === 'active').map((r) => r.clientId)).size}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Nuevos Este Mes</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {
                clients.filter((c) => {
                  const clientDate = new Date(c.createdAt);
                  const now = new Date();
                  return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
                }).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const activeReservations = getClientActiveReservations(client.id);
          const totalReservations = getClientReservations(client.id);
          const totalSpaces = activeReservations.reduce((sum, r) => sum + r.spaceIds.length, 0);

          return (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setSelectedClient(client.id)}
            >
              <CardHeader className="bg-gradient-to-r from-ice-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{client.rfc}</p>
                  </div>
                  {activeReservations.length > 0 && (
                    <Badge variant="success">Activo</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                <hr />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-gray-500">Reservaciones</p>
                    <p className="text-lg font-bold text-ice-600">{totalReservations.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Espacios Activos</p>
                    <p className="text-lg font-bold text-green-600">{totalSpaces}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nuevo Cliente" size="md">
        <div className="space-y-4">
          <Input
            label="Nombre / Razón Social"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="Ej: Alimentos del Norte SA de CV"
          />
          <Input
            label="RFC"
            value={newClient.rfc}
            onChange={(e) => setNewClient({ ...newClient, rfc: e.target.value })}
            placeholder="Ej: ADN850123ABC"
          />
          <Input
            label="Teléfono"
            type="tel"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            placeholder="Ej: 811-234-5678"
          />
          <Input
            label="Email"
            type="email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            placeholder="Ej: contacto@empresa.mx"
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleAddClient}
              className="flex-1"
              disabled={!newClient.name || !newClient.rfc || !newClient.phone || !newClient.email}
            >
              Guardar Cliente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Client Detail Modal */}
      <Modal
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        title="Detalle del Cliente"
        size="lg"
      >
        {selectedClientData && (
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-ice-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">{selectedClientData.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">RFC</p>
                  <p className="font-medium">{selectedClientData.rfc}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{selectedClientData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedClientData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente desde</p>
                  <p className="font-medium">
                    {format(new Date(selectedClientData.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Reservations History */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Historial de Reservaciones</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedClientReservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay reservaciones</p>
                ) : (
                  selectedClientReservations.map((reservation) => (
                    <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Reservación #{reservation.id}</span>
                        <Badge
                          variant={
                            reservation.status === 'active'
                              ? 'success'
                              : reservation.status === 'expired'
                              ? 'danger'
                              : 'default'
                          }
                        >
                          {reservation.status === 'active' && 'Activa'}
                          {reservation.status === 'expired' && 'Vencida'}
                          {reservation.status === 'completed' && 'Completada'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Espacios</p>
                          <p className="font-medium">{reservation.spaceIds.length} espacios</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Periodo</p>
                          <p className="font-medium">{reservation.totalDays} días</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fecha inicio</p>
                          <p className="font-medium">
                            {format(new Date(reservation.startDate), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-medium text-green-600">
                            ${reservation.total.toLocaleString('es-MX')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
