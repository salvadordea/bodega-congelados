import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Search, Plus, Calendar, MapPin, User, DollarSign, Edit, Trash2, RefreshCw } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

type FilterType = 'all' | 'active' | 'expired' | 'completed';

export const Reservations: React.FC = () => {
  const { reservations, clients, deleteReservation, updateReservation } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(30);

  const filteredReservations = reservations.filter((reservation) => {
    // Filter by status
    if (filter !== 'all' && reservation.status !== filter) return false;

    // Filter by search term
    if (searchTerm) {
      const client = clients.find((c) => c.id === reservation.clientId);
      const searchLower = searchTerm.toLowerCase();
      return (
        client?.name.toLowerCase().includes(searchLower) ||
        client?.rfc.toLowerCase().includes(searchLower) ||
        reservation.id.toLowerCase().includes(searchLower) ||
        reservation.spaceIds.some((id) => id.toString().includes(searchTerm))
      );
    }

    return true;
  });

  const selectedReservationData = selectedReservation
    ? reservations.find((r) => r.id === selectedReservation)
    : null;
  const selectedClient = selectedReservationData
    ? clients.find((c) => c.id === selectedReservationData.clientId)
    : null;

  const handleExtendReservation = () => {
    if (!selectedReservationData) return;

    const newEndDate = addDays(new Date(selectedReservationData.endDate), extendDays);
    const newTotalDays = selectedReservationData.totalDays + extendDays;
    const newSubtotal =
      selectedReservationData.spaceIds.length * newTotalDays * selectedReservationData.pricePerDay +
      selectedReservationData.handlingFee;
    const newTax = newSubtotal * 0.16;
    const newTotal = newSubtotal + newTax;

    updateReservation(selectedReservationData.id, {
      endDate: newEndDate,
      totalDays: newTotalDays,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
    });

    setIsExtendModalOpen(false);
    setSelectedReservation(null);
  };

  const handleDeleteReservation = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta reservación?')) {
      deleteReservation(id);
      setSelectedReservation(null);
    }
  };

  const stats = {
    total: reservations.length,
    active: reservations.filter((r) => r.status === 'active').length,
    expired: reservations.filter((r) => r.status === 'expired').length,
    completed: reservations.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservaciones</h1>
          <p className="text-gray-600">Gestión de reservaciones activas y historial</p>
        </div>
        <Button onClick={() => navigate('/new-reservation')} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva Reservación
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, RFC, ID de reservación o número de espacio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ice-500 focus:border-ice-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-ice-600' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${filter === 'active' ? 'ring-2 ring-green-600' : ''}`}
          onClick={() => setFilter('active')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Activas</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${filter === 'expired' ? 'ring-2 ring-red-600' : ''}`}
          onClick={() => setFilter('expired')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            <p className="text-sm text-gray-600">Vencidas</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${filter === 'completed' ? 'ring-2 ring-blue-600' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No se encontraron reservaciones</p>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => {
            const client = clients.find((c) => c.id === reservation.clientId);
            const daysRemaining = Math.ceil(
              (new Date(reservation.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card
                key={reservation.id}
                className="cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedReservation(reservation.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-800">
                          Reservación #{reservation.id}
                        </h3>
                        <Badge
                          variant={
                            reservation.status === 'active'
                              ? 'success'
                              : reservation.status === 'expired'
                              ? 'danger'
                              : 'info'
                          }
                        >
                          {reservation.status === 'active' && 'Activa'}
                          {reservation.status === 'expired' && 'Vencida'}
                          {reservation.status === 'completed' && 'Completada'}
                        </Badge>
                        {daysRemaining <= 7 && daysRemaining > 0 && (
                          <Badge variant="warning">Vence en {daysRemaining} días</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium">{client?.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Espacios</p>
                            <p className="font-medium">{reservation.spaceIds.length} espacios</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Periodo</p>
                            <p className="font-medium">
                              {format(new Date(reservation.startDate), 'dd/MM/yy')} -{' '}
                              {format(new Date(reservation.endDate), 'dd/MM/yy')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-medium text-green-600">
                              ${reservation.total.toLocaleString('es-MX')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Reservation Detail Modal */}
      <Modal
        isOpen={selectedReservation !== null}
        onClose={() => setSelectedReservation(null)}
        title="Detalle de Reservación"
        size="lg"
      >
        {selectedReservationData && selectedClient && (
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-ice-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Cliente</h4>
              <p className="font-medium">{selectedClient.name}</p>
              <p className="text-sm text-gray-600">{selectedClient.rfc}</p>
              <p className="text-sm text-gray-600">{selectedClient.email}</p>
              <p className="text-sm text-gray-600">{selectedClient.phone}</p>
            </div>

            {/* Reservation Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Reservación</p>
                <p className="font-medium">{selectedReservationData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge
                  variant={
                    selectedReservationData.status === 'active'
                      ? 'success'
                      : selectedReservationData.status === 'expired'
                      ? 'danger'
                      : 'info'
                  }
                >
                  {selectedReservationData.status === 'active' && 'Activa'}
                  {selectedReservationData.status === 'expired' && 'Vencida'}
                  {selectedReservationData.status === 'completed' && 'Completada'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Inicio</p>
                <p className="font-medium">
                  {format(new Date(selectedReservationData.startDate), 'dd MMMM yyyy', { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Fin</p>
                <p className="font-medium">
                  {format(new Date(selectedReservationData.endDate), 'dd MMMM yyyy', { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="font-medium">{selectedReservationData.totalDays} días</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Espacios</p>
                <p className="font-medium">{selectedReservationData.spaceIds.length} espacios</p>
              </div>
            </div>

            {/* Spaces */}
            <div>
              <p className="font-semibold mb-2">Espacios Asignados</p>
              <div className="flex flex-wrap gap-2">
                {selectedReservationData.spaceIds.map((id) => (
                  <span
                    key={id}
                    className="bg-ice-100 text-ice-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{id}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="font-semibold mb-3">Desglose de Costos</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${selectedReservationData.subtotal.toLocaleString('es-MX')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (16%)</span>
                  <span className="font-medium">${selectedReservationData.tax.toLocaleString('es-MX')}</span>
                </div>
                <hr className="border-green-300" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">
                    ${selectedReservationData.total.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedReservationData.status === 'active' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsExtendModalOpen(true);
                    setSelectedReservation(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Extender Estadía
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => handleDeleteReservation(selectedReservationData.id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Extend Reservation Modal */}
      <Modal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        title="Extender Estadía"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Días adicionales"
            type="number"
            min="1"
            value={extendDays}
            onChange={(e) => setExtendDays(parseInt(e.target.value) || 1)}
          />
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              La reservación se extenderá por <strong>{extendDays}</strong> días adicionales
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsExtendModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleExtendReservation} className="flex-1">
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
