import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { pricingConfig } from '../data/mockData';
import { Sparkles, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { addDays } from 'date-fns';

type Step = 1 | 2 | 3 | 4;

export const NewReservation: React.FC = () => {
  const { clients, spaces, addReservation, reservations } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Form data
  const [selectedClientId, setSelectedClientId] = useState('');
  const [spacesNeeded, setSpacesNeeded] = useState(1);
  const [duration, setDuration] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSpaces, setSelectedSpaces] = useState<number[]>([]);
  const [useSmartSuggestion, setUseSmartSuggestion] = useState(false);

  const availableSpaces = spaces.filter((s) => s.status === 'available');

  // Smart suggestion algorithm
  const getSuggestedSpaces = (count: number): number[] => {
    if (count > availableSpaces.length) return [];

    const suggestions: number[] = [];
    const sortedSpaces = [...availableSpaces].sort((a, b) => a.id - b.id);

    // Try to find contiguous spaces
    for (let i = 0; i <= sortedSpaces.length - count; i++) {
      const potentialGroup = sortedSpaces.slice(i, i + count);
      const ids = potentialGroup.map((s) => s.id);
      const isContiguous = ids.every((id, index) => index === 0 || id === ids[index - 1] + 1);

      if (isContiguous) {
        return ids;
      }
    }

    // If no contiguous spaces found, get closest ones
    return sortedSpaces.slice(0, count).map((s) => s.id);
  };

  const handleSmartSuggestion = () => {
    const suggested = getSuggestedSpaces(spacesNeeded);
    setSelectedSpaces(suggested);
    setUseSmartSuggestion(true);
  };

  const toggleSpace = (spaceId: number) => {
    setUseSmartSuggestion(false);
    if (selectedSpaces.includes(spaceId)) {
      setSelectedSpaces(selectedSpaces.filter((id) => id !== spaceId));
    } else {
      setSelectedSpaces([...selectedSpaces, spaceId]);
    }
  };

  // Calculate costs
  const calculateCosts = () => {
    const subtotal =
      selectedSpaces.length * duration * pricingConfig.pricePerDayPerSpace + pricingConfig.handlingFee;
    const tax = subtotal * pricingConfig.taxRate;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateCosts();

  const handleSubmit = () => {
    const reservation = {
      id: `r${reservations.length + 1}`,
      clientId: selectedClientId,
      spaceIds: selectedSpaces,
      startDate: new Date(startDate),
      endDate: addDays(new Date(startDate), duration),
      totalDays: duration,
      pricePerDay: pricingConfig.pricePerDayPerSpace,
      handlingFee: pricingConfig.handlingFee,
      subtotal,
      tax,
      total,
      status: 'active' as const,
    };

    addReservation(reservation);
    navigate('/reservations');
  };

  const canProceedStep1 = selectedClientId !== '';
  const canProceedStep2 = spacesNeeded > 0 && duration > 0;
  const canProceedStep3 = selectedSpaces.length > 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Nueva Reservación</h1>
        <p className="text-gray-600">Crea una nueva reservación siguiendo los pasos</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-ice-600 text-white' : 'bg-gray-300 text-gray-600'
              } transition-all`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-20 h-1 ${step > s ? 'bg-ice-600' : 'bg-gray-300'} transition-all`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Client */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Seleccionar Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Cliente"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={[
                { value: '', label: 'Selecciona un cliente...' },
                ...clients.map((c) => ({ value: c.id, label: `${c.name} (${c.rfc})` })),
              ]}
            />

            {selectedClientId && (
              <div className="bg-ice-50 p-4 rounded-lg">
                <p className="font-semibold">Cliente seleccionado:</p>
                <p className="text-gray-700">{clients.find((c) => c.id === selectedClientId)?.name}</p>
                <p className="text-sm text-gray-600">
                  {clients.find((c) => c.id === selectedClientId)?.email}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure Reservation */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Configurar Reservación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Cantidad de Espacios"
                type="number"
                min="1"
                max={availableSpaces.length}
                value={spacesNeeded}
                onChange={(e) => setSpacesNeeded(parseInt(e.target.value) || 1)}
              />
              <Input
                label="Duración (días)"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              />
              <Input
                label="Fecha de Inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Resumen</p>
              </div>
              <p className="text-sm text-gray-700">
                Reservando <strong>{spacesNeeded}</strong> espacio(s) por <strong>{duration}</strong> días
              </p>
              <p className="text-sm text-gray-700">
                Desde: <strong>{new Date(startDate).toLocaleDateString('es-MX')}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Hasta:{' '}
                <strong>{addDays(new Date(startDate), duration).toLocaleDateString('es-MX')}</strong>
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Spaces */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Paso 3: Seleccionar Espacios</CardTitle>
              <Button
                variant="outline"
                onClick={handleSmartSuggestion}
                className="flex items-center gap-2"
                size="sm"
              >
                <Sparkles className="w-4 h-4" />
                Sugerencia Inteligente
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {useSmartSuggestion && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Espacios sugeridos</p>
                  <p className="text-sm text-green-700">
                    Hemos seleccionado los mejores espacios disponibles contiguos para tu reservación
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Espacios seleccionados: <strong>{selectedSpaces.length}</strong> / <strong>{spacesNeeded}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSpaces.map((id) => (
                  <span
                    key={id}
                    className="bg-ice-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{id}
                  </span>
                ))}
              </div>
            </div>

            {/* Space Grid */}
            <div className="max-h-96 overflow-y-auto">
              {['A', 'B', 'C', 'D'].map((section) => {
                const sectionSpaces = availableSpaces.filter((s) => s.section === section);
                if (sectionSpaces.length === 0) return null;

                return (
                  <div key={section} className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Sección {section}</h4>
                    <div className="grid grid-cols-10 gap-2">
                      {sectionSpaces.map((space) => (
                        <button
                          key={space.id}
                          onClick={() => toggleSpace(space.id)}
                          className={`p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                            selectedSpaces.includes(space.id)
                              ? 'bg-ice-600 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {space.id}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button onClick={() => setStep(4)} disabled={!canProceedStep3}>
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 4: Revisar y Confirmar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Info */}
            <div className="bg-ice-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Cliente</p>
              <p className="text-gray-800">{clients.find((c) => c.id === selectedClientId)?.name}</p>
              <p className="text-sm text-gray-600">
                {clients.find((c) => c.id === selectedClientId)?.rfc}
              </p>
            </div>

            {/* Reservation Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Detalles de la Reservación</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Espacios:</p>
                  <p className="font-medium">{selectedSpaces.length} espacios</p>
                </div>
                <div>
                  <p className="text-gray-600">Duración:</p>
                  <p className="font-medium">{duration} días</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha inicio:</p>
                  <p className="font-medium">{new Date(startDate).toLocaleDateString('es-MX')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha fin:</p>
                  <p className="font-medium">
                    {addDays(new Date(startDate), duration).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Spaces */}
            <div>
              <p className="font-semibold mb-2">Espacios Seleccionados</p>
              <div className="flex flex-wrap gap-2">
                {selectedSpaces.map((id) => (
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
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-900">Desglose de Costos</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Almacenamiento ({selectedSpaces.length} espacios × {duration} días × $
                    {pricingConfig.pricePerDayPerSpace})
                  </span>
                  <span className="font-medium">
                    ${(selectedSpaces.length * duration * pricingConfig.pricePerDayPerSpace).toLocaleString(
                      'es-MX'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Maniobra (carga/descarga)</span>
                  <span className="font-medium">${pricingConfig.handlingFee.toLocaleString('es-MX')}</span>
                </div>
                <hr className="border-green-200" />
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">IVA (16%)</span>
                  <span className="font-medium">${tax.toLocaleString('es-MX')}</span>
                </div>
                <hr className="border-green-300" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-green-900">Total</span>
                  <span className="font-bold text-green-900">${total.toLocaleString('es-MX')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Atrás
              </Button>
              <Button onClick={handleSubmit} variant="success" className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Crear Reservación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
