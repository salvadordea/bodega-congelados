import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

type FilterType = 'all' | 'available' | 'reserved' | 'expiring-soon';

export const Spaces: React.FC = () => {
  const { spaces, clients, reservations } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);

  const filteredSpaces = spaces.filter((space) => {
    if (filter === 'all') return true;
    return space.status === filter;
  });

  const getSpaceColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'reserved':
        return 'bg-red-500 hover:bg-red-600';
      case 'expiring-soon':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getSpaceTextColor = () => {
    return 'text-white';
  };

  const selectedSpaceData = selectedSpace ? spaces.find((s) => s.id === selectedSpace) : null;
  const selectedReservation = selectedSpaceData?.reservationId
    ? reservations.find((r) => r.id === selectedSpaceData.reservationId)
    : null;
  const selectedClient = selectedReservation
    ? clients.find((c) => c.id === selectedReservation.clientId)
    : null;

  const stats = {
    total: spaces.length,
    available: spaces.filter((s) => s.status === 'available').length,
    reserved: spaces.filter((s) => s.status === 'reserved').length,
    expiring: spaces.filter((s) => s.status === 'expiring-soon').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mapa de Espacios</h1>
        <p className="text-gray-600">Vista interactiva de los 100 espacios de la bodega</p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          className={`cursor-pointer transition-all ${filter === 'available' ? 'ring-2 ring-green-600' : ''}`}
          onClick={() => setFilter('available')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            <p className="text-sm text-gray-600">Disponibles</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${filter === 'reserved' ? 'ring-2 ring-red-600' : ''}`}
          onClick={() => setFilter('reserved')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.reserved}</p>
            <p className="text-sm text-gray-600">Reservados</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${filter === 'expiring-soon' ? 'ring-2 ring-yellow-600' : ''}`}
          onClick={() => setFilter('expiring-soon')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
            <p className="text-sm text-gray-600">Por Vencer</p>
          </CardContent>
        </Card>
      </div>

      {/* Space Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Grid de Espacios</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Reservado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Por Vencer</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Section A */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sección A (1-25)</h3>
            <div className="grid grid-cols-10 gap-2">
              {filteredSpaces
                .filter((s) => s.section === 'A')
                .map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`${getSpaceColor(space.status)} ${getSpaceTextColor()} p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md`}
                  >
                    {space.id}
                  </button>
                ))}
            </div>
          </div>

          {/* Section B */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sección B (26-50)</h3>
            <div className="grid grid-cols-10 gap-2">
              {filteredSpaces
                .filter((s) => s.section === 'B')
                .map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`${getSpaceColor(space.status)} ${getSpaceTextColor()} p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md`}
                  >
                    {space.id}
                  </button>
                ))}
            </div>
          </div>

          {/* Section C */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sección C (51-75)</h3>
            <div className="grid grid-cols-10 gap-2">
              {filteredSpaces
                .filter((s) => s.section === 'C')
                .map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`${getSpaceColor(space.status)} ${getSpaceTextColor()} p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md`}
                  >
                    {space.id}
                  </button>
                ))}
            </div>
          </div>

          {/* Section D */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sección D (76-100)</h3>
            <div className="grid grid-cols-10 gap-2">
              {filteredSpaces
                .filter((s) => s.section === 'D')
                .map((space) => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`${getSpaceColor(space.status)} ${getSpaceTextColor()} p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 shadow-md`}
                  >
                    {space.id}
                  </button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Space Detail Modal */}
      <Modal
        isOpen={selectedSpace !== null}
        onClose={() => setSelectedSpace(null)}
        title={`Espacio #${selectedSpace}`}
        size="md"
      >
        {selectedSpaceData && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <Badge
                variant={
                  selectedSpaceData.status === 'available'
                    ? 'success'
                    : selectedSpaceData.status === 'expiring-soon'
                    ? 'warning'
                    : 'danger'
                }
                className="mt-1"
              >
                {selectedSpaceData.status === 'available' && 'Disponible'}
                {selectedSpaceData.status === 'reserved' && 'Reservado'}
                {selectedSpaceData.status === 'expiring-soon' && 'Próximo a Vencer'}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600">Sección</p>
              <p className="font-semibold">{selectedSpaceData.section}</p>
            </div>

            {selectedClient && selectedReservation && (
              <>
                <hr />
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold">{selectedClient.name}</p>
                  <p className="text-sm text-gray-500">{selectedClient.rfc}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Periodo</p>
                  <p className="font-semibold">
                    {new Date(selectedReservation.startDate).toLocaleDateString('es-MX')} -{' '}
                    {new Date(selectedReservation.endDate).toLocaleDateString('es-MX')}
                  </p>
                  <p className="text-sm text-gray-500">{selectedReservation.totalDays} días</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Espacios en esta reservación</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedReservation.spaceIds.map((id) => (
                      <span key={id} className="bg-ice-100 text-ice-800 px-2 py-1 rounded text-sm font-medium">
                        #{id}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
