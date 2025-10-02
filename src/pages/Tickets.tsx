import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Download, Printer, Snowflake } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

export const Tickets: React.FC = () => {
  const { reservations, clients } = useApp();
  const [selectedReservationId, setSelectedReservationId] = useState('');

  const selectedReservation = reservations.find((r) => r.id === selectedReservationId);
  const selectedClient = selectedReservation
    ? clients.find((c) => c.id === selectedReservation.clientId)
    : null;

  const generatePDF = () => {
    if (!selectedReservation || !selectedClient) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(14, 165, 233); // ice-600
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('FreezeStore', 15, 20);

    doc.setFontSize(12);
    doc.text('Sistema de Gestión de Bodega de Congelados', 15, 30);

    // Ticket Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text('TICKET DE COBRO', 15, 55);

    doc.setFontSize(10);
    doc.text(`Folio: ${selectedReservation.id}`, 15, 65);
    doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 15, 72);

    // Client Info
    doc.setFontSize(14);
    doc.text('DATOS DEL CLIENTE', 15, 90);

    doc.setFontSize(10);
    doc.text(`Cliente: ${selectedClient.name}`, 15, 100);
    doc.text(`RFC: ${selectedClient.rfc}`, 15, 107);
    doc.text(`Teléfono: ${selectedClient.phone}`, 15, 114);
    doc.text(`Email: ${selectedClient.email}`, 15, 121);

    // Reservation Details
    doc.setFontSize(14);
    doc.text('DETALLES DE LA RESERVACIÓN', 15, 140);

    doc.setFontSize(10);
    doc.text(`Fecha Inicio: ${format(new Date(selectedReservation.startDate), 'dd/MM/yyyy')}`, 15, 150);
    doc.text(`Fecha Fin: ${format(new Date(selectedReservation.endDate), 'dd/MM/yyyy')}`, 15, 157);
    doc.text(`Días Totales: ${selectedReservation.totalDays}`, 15, 164);

    // Spaces
    doc.text('Espacios Utilizados:', 15, 174);
    const spacesText = selectedReservation.spaceIds.map((id) => `#${id}`).join(', ');
    const spacesLines = doc.splitTextToSize(spacesText, pageWidth - 30);
    doc.text(spacesLines, 15, 181);

    // Cost Breakdown
    const costY = 181 + spacesLines.length * 7 + 10;

    doc.setFillColor(240, 240, 240);
    doc.rect(15, costY, pageWidth - 30, 7, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCEPTO', 20, costY + 5);
    doc.text('IMPORTE', pageWidth - 50, costY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let currentY = costY + 15;

    // Storage cost
    const storageCost = selectedReservation.spaceIds.length * selectedReservation.totalDays * selectedReservation.pricePerDay;
    doc.text(
      `Almacenamiento (${selectedReservation.spaceIds.length} espacios × ${selectedReservation.totalDays} días × $${selectedReservation.pricePerDay})`,
      20,
      currentY
    );
    doc.text(`$${storageCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - 50, currentY, { align: 'right' });

    currentY += 7;

    // Handling fee
    doc.text('Maniobra (carga/descarga)', 20, currentY);
    doc.text(`$${selectedReservation.handlingFee.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - 50, currentY, { align: 'right' });

    currentY += 10;

    // Subtotal
    doc.setFont('helvetica', 'bold');
    doc.text('SUBTOTAL:', 20, currentY);
    doc.text(`$${selectedReservation.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - 50, currentY, { align: 'right' });

    currentY += 7;

    // Tax
    doc.setFont('helvetica', 'normal');
    doc.text('IVA (16%):', 20, currentY);
    doc.text(`$${selectedReservation.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - 50, currentY, { align: 'right' });

    currentY += 10;

    // Total
    doc.setFillColor(14, 165, 233);
    doc.rect(15, currentY - 5, pageWidth - 30, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 20, currentY + 2);
    doc.text(`$${selectedReservation.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, pageWidth - 50, currentY + 2, { align: 'right' });

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por su preferencia', pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    doc.text('FreezeStore - Sistema de Gestión de Bodega de Congelados', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    // Save PDF
    doc.save(`ticket-${selectedReservation.id}-${format(new Date(), 'yyyyMMdd-HHmmss')}.pdf`);
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Generar Ticket de Cobro</h1>
        <p className="text-gray-600">Crea tickets profesionales para tus reservaciones</p>
      </div>

      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Reservación</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            label="Reservación"
            value={selectedReservationId}
            onChange={(e) => setSelectedReservationId(e.target.value)}
            options={[
              { value: '', label: 'Selecciona una reservación...' },
              ...reservations.map((r) => {
                const client = clients.find((c) => c.id === r.clientId);
                return {
                  value: r.id,
                  label: `${r.id} - ${client?.name} - ${r.spaceIds.length} espacios - $${r.total.toLocaleString('es-MX')}`,
                };
              }),
            ]}
          />
        </CardContent>
      </Card>

      {/* Ticket Preview */}
      {selectedReservation && selectedClient && (
        <>
          <Card className="print:shadow-none">
            <CardContent className="p-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-ice-600 to-blue-600 -mx-8 -mt-8 px-8 py-6 mb-8 print:bg-ice-600">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white p-2 rounded-lg">
                    <Snowflake className="w-8 h-8 text-ice-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">FreezeStore</h2>
                    <p className="text-ice-100">Sistema de Gestión de Bodega de Congelados</p>
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">TICKET DE COBRO</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Folio:</p>
                    <p className="font-semibold text-lg">{selectedReservation.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha de Emisión:</p>
                    <p className="font-semibold">{format(new Date(), 'dd MMMM yyyy, HH:mm')}</p>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-ice-50 p-6 rounded-lg mb-8">
                <h4 className="font-bold text-gray-800 mb-4">DATOS DEL CLIENTE</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Cliente / Razón Social:</p>
                    <p className="font-semibold">{selectedClient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RFC:</p>
                    <p className="font-semibold">{selectedClient.rfc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono:</p>
                    <p className="font-semibold">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-semibold">{selectedClient.email}</p>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-800 mb-4">DETALLES DE LA RESERVACIÓN</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha Inicio:</p>
                    <p className="font-semibold">
                      {format(new Date(selectedReservation.startDate), 'dd MMMM yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha Fin:</p>
                    <p className="font-semibold">
                      {format(new Date(selectedReservation.endDate), 'dd MMMM yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Días Totales:</p>
                    <p className="font-semibold">{selectedReservation.totalDays} días</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Espacios Utilizados:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReservation.spaceIds.map((id) => (
                      <span
                        key={id}
                        className="bg-ice-100 text-ice-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h4 className="font-bold text-gray-800 mb-4">DESGLOSE DE COSTOS</h4>

                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 p-3 rounded font-semibold">
                    <div>CONCEPTO</div>
                    <div className="text-right">IMPORTE</div>
                  </div>

                  {/* Storage */}
                  <div className="grid grid-cols-2 gap-4 p-3">
                    <div>
                      <p className="font-medium">Almacenamiento</p>
                      <p className="text-sm text-gray-600">
                        {selectedReservation.spaceIds.length} espacios × {selectedReservation.totalDays} días × $
                        {selectedReservation.pricePerDay}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      $
                      {(
                        selectedReservation.spaceIds.length *
                        selectedReservation.totalDays *
                        selectedReservation.pricePerDay
                      ).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Handling */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50">
                    <div>
                      <p className="font-medium">Maniobra (carga/descarga)</p>
                    </div>
                    <div className="text-right font-semibold">
                      ${selectedReservation.handlingFee.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="grid grid-cols-2 gap-4 p-3 border-t border-gray-300">
                    <div className="font-bold">SUBTOTAL:</div>
                    <div className="text-right font-bold">
                      ${selectedReservation.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="grid grid-cols-2 gap-4 p-3">
                    <div>IVA (16%):</div>
                    <div className="text-right font-semibold">
                      ${selectedReservation.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-ice-600 to-blue-600 text-white rounded-lg">
                    <div className="text-xl font-bold">TOTAL:</div>
                    <div className="text-right text-2xl font-bold">
                      ${selectedReservation.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center text-gray-600 text-sm border-t pt-6">
                <p className="font-semibold">Gracias por su preferencia</p>
                <p>FreezeStore - Sistema de Gestión de Bodega de Congelados</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 print:hidden">
            <Button onClick={generatePDF} variant="success" className="flex-1 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Descargar PDF
            </Button>
            <Button onClick={printTicket} variant="primary" className="flex-1 flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" />
              Imprimir
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
