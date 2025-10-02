import type { Client, Reservation, Space, PricingConfig } from '../types';
import { addDays, subDays } from 'date-fns';

export const pricingConfig: PricingConfig = {
  pricePerDayPerSpace: 150,
  handlingFee: 500,
  taxRate: 0.16,
};

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Alimentos del Norte SA de CV',
    rfc: 'ADN850123ABC',
    phone: '811-234-5678',
    email: 'contacto@alimentosnorte.mx',
    createdAt: subDays(new Date(), 365),
  },
  {
    id: 'c2',
    name: 'Distribuidora La Fría',
    rfc: 'DLF900215XYZ',
    phone: '811-345-6789',
    email: 'ventas@lafria.mx',
    createdAt: subDays(new Date(), 300),
  },
  {
    id: 'c3',
    name: 'Mariscos del Pacífico',
    rfc: 'MDP920318DEF',
    phone: '811-456-7890',
    email: 'info@mariscospacifico.mx',
    createdAt: subDays(new Date(), 250),
  },
  {
    id: 'c4',
    name: 'Carnes Premium Internacional',
    rfc: 'CPI880622GHI',
    phone: '811-567-8901',
    email: 'contacto@carnespremium.mx',
    createdAt: subDays(new Date(), 200),
  },
  {
    id: 'c5',
    name: 'Productos Congelados MTY',
    rfc: 'PCM910430JKL',
    phone: '811-678-9012',
    email: 'ventas@congeladosmty.mx',
    createdAt: subDays(new Date(), 180),
  },
  {
    id: 'c6',
    name: 'Helados y Nieves del Valle',
    rfc: 'HNV950512MNO',
    phone: '811-789-0123',
    email: 'info@heladosvalle.mx',
    createdAt: subDays(new Date(), 150),
  },
  {
    id: 'c7',
    name: 'Pescados y Mariscos del Golfo',
    rfc: 'PMG870825PQR',
    phone: '811-890-1234',
    email: 'ventas@mariscogolfo.mx',
    createdAt: subDays(new Date(), 120),
  },
  {
    id: 'c8',
    name: 'Frutas Congeladas Tropi-Fresh',
    rfc: 'FCT930707STU',
    phone: '811-901-2345',
    email: 'contacto@tropifresh.mx',
    createdAt: subDays(new Date(), 100),
  },
  {
    id: 'c9',
    name: 'Distribuidora de Vegetales Frescos',
    rfc: 'DVF960918VWX',
    phone: '811-012-3456',
    email: 'info@vegetalesfrescos.mx',
    createdAt: subDays(new Date(), 90),
  },
  {
    id: 'c10',
    name: 'Pollos y Aves del Norte',
    rfc: 'PAN890204YZA',
    phone: '811-123-4567',
    email: 'ventas@pollosnorte.mx',
    createdAt: subDays(new Date(), 80),
  },
  {
    id: 'c11',
    name: 'Lácteos Refrigerados MTY',
    rfc: 'LRM920615BCD',
    phone: '811-234-5670',
    email: 'contacto@lacteosmty.mx',
    createdAt: subDays(new Date(), 70),
  },
  {
    id: 'c12',
    name: 'Procesadora de Alimentos del Noreste',
    rfc: 'PAN880921EFG',
    phone: '811-345-6781',
    email: 'info@procesadoranoreste.mx',
    createdAt: subDays(new Date(), 60),
  },
  {
    id: 'c13',
    name: 'Restaurantes Gourmet SA',
    rfc: 'RGS910508HIJ',
    phone: '811-456-7892',
    email: 'compras@restaurantegourmet.mx',
    createdAt: subDays(new Date(), 50),
  },
  {
    id: 'c14',
    name: 'Hoteles del Centro',
    rfc: 'HDC950312KLM',
    phone: '811-567-8903',
    email: 'almacen@hotelescentro.mx',
    createdAt: subDays(new Date(), 45),
  },
  {
    id: 'c15',
    name: 'Catering y Eventos Premium',
    rfc: 'CEP930724NOP',
    phone: '811-678-9014',
    email: 'logistica@cateringpremium.mx',
    createdAt: subDays(new Date(), 40),
  },
  {
    id: 'c16',
    name: 'Supermercados Regionales',
    rfc: 'SRE870119QRS',
    phone: '811-789-0125',
    email: 'compras@superregionales.mx',
    createdAt: subDays(new Date(), 35),
  },
  {
    id: 'c17',
    name: 'Exportadora de Productos Mexicanos',
    rfc: 'EPM940806TUV',
    phone: '811-890-1236',
    email: 'ventas@exportadoramex.mx',
    createdAt: subDays(new Date(), 30),
  },
  {
    id: 'c18',
    name: 'Alimentos Orgánicos del Campo',
    rfc: 'AOC920225WXY',
    phone: '811-901-2347',
    email: 'info@alimentosorganicos.mx',
    createdAt: subDays(new Date(), 25),
  },
  {
    id: 'c19',
    name: 'Comidas Preparadas Express',
    rfc: 'CPE960417ZAB',
    phone: '811-012-3458',
    email: 'operaciones@comidasexpress.mx',
    createdAt: subDays(new Date(), 20),
  },
  {
    id: 'c20',
    name: 'Panadería Industrial del Norte',
    rfc: 'PIN880630CDE',
    phone: '811-123-4569',
    email: 'ventas@panaderianorte.mx',
    createdAt: subDays(new Date(), 15),
  },
  {
    id: 'c21',
    name: 'Bebidas y Jugos Naturales',
    rfc: 'BJN910503FGH',
    phone: '811-234-5671',
    email: 'contacto@bebidasnaturales.mx',
    createdAt: subDays(new Date(), 12),
  },
  {
    id: 'c22',
    name: 'Carnes Frías Premium',
    rfc: 'CFP950914IJK',
    phone: '811-345-6782',
    email: 'ventas@carnesfrias.mx',
    createdAt: subDays(new Date(), 10),
  },
  {
    id: 'c23',
    name: 'Productos del Mar Atlántico',
    rfc: 'PMA870228LMN',
    phone: '811-456-7893',
    email: 'info@maratlantico.mx',
    createdAt: subDays(new Date(), 8),
  },
  {
    id: 'c24',
    name: 'Verduras Selectas del Valle',
    rfc: 'VSV930611OPQ',
    phone: '811-567-8904',
    email: 'ventas@verdurasselectas.mx',
    createdAt: subDays(new Date(), 5),
  },
  {
    id: 'c25',
    name: 'Importadora de Alimentos Asiáticos',
    rfc: 'IAA960123RST',
    phone: '811-678-9015',
    email: 'importaciones@alimentosasiaticos.mx',
    createdAt: subDays(new Date(), 3),
  },
];

const calculateReservation = (
  clientId: string,
  spaceIds: number[],
  startDate: Date,
  durationDays: number
): Omit<Reservation, 'id'> => {
  const endDate = addDays(startDate, durationDays);
  const subtotal = spaceIds.length * durationDays * pricingConfig.pricePerDayPerSpace + pricingConfig.handlingFee;
  const tax = subtotal * pricingConfig.taxRate;
  const total = subtotal + tax;

  const now = new Date();

  let status: 'active' | 'completed' | 'expired' = 'active';
  if (endDate < now) {
    status = 'expired';
  } else if (now >= startDate && now <= endDate) {
    status = 'active';
  }

  return {
    clientId,
    spaceIds,
    startDate,
    endDate,
    totalDays: durationDays,
    pricePerDay: pricingConfig.pricePerDayPerSpace,
    handlingFee: pricingConfig.handlingFee,
    subtotal,
    tax,
    total,
    status,
  };
};

export const mockReservations: Reservation[] = [
  { id: 'r1', ...calculateReservation('c1', [1, 2, 3, 4], subDays(new Date(), 5), 30) },
  { id: 'r2', ...calculateReservation('c2', [8, 9, 10], subDays(new Date(), 10), 45) },
  { id: 'r3', ...calculateReservation('c3', [15, 16], subDays(new Date(), 3), 60) },
  { id: 'r4', ...calculateReservation('c4', [22, 23, 24, 25], subDays(new Date(), 15), 90) },
  { id: 'r5', ...calculateReservation('c5', [30, 31, 32], subDays(new Date(), 7), 25) },
  { id: 'r6', ...calculateReservation('c6', [38, 39], subDays(new Date(), 2), 20) },
  { id: 'r7', ...calculateReservation('c7', [45, 46, 47], subDays(new Date(), 12), 40) },
  { id: 'r8', ...calculateReservation('c8', [52, 53], subDays(new Date(), 8), 35) },
  { id: 'r9', ...calculateReservation('c9', [58, 59, 60, 61], subDays(new Date(), 4), 50) },
  { id: 'r10', ...calculateReservation('c10', [67, 68], subDays(new Date(), 20), 70) },
  { id: 'r11', ...calculateReservation('c11', [74, 75, 76], subDays(new Date(), 1), 15) },
  { id: 'r12', ...calculateReservation('c12', [82, 83], subDays(new Date(), 18), 55) },
  { id: 'r13', ...calculateReservation('c13', [88, 89, 90], subDays(new Date(), 6), 28) },
  { id: 'r14', ...calculateReservation('c14', [5, 6], subDays(new Date(), 9), 42) },
  { id: 'r15', ...calculateReservation('c15', [11, 12, 13], subDays(new Date(), 11), 33) },
  { id: 'r16', ...calculateReservation('c16', [17, 18, 19, 20], subDays(new Date(), 14), 48) },
  { id: 'r17', ...calculateReservation('c17', [26, 27], subDays(new Date(), 3), 22) },
  { id: 'r18', ...calculateReservation('c18', [33, 34, 35], subDays(new Date(), 16), 65) },
  { id: 'r19', ...calculateReservation('c19', [40, 41], subDays(new Date(), 5), 18) },
  { id: 'r20', ...calculateReservation('c20', [48, 49, 50, 51], subDays(new Date(), 13), 38) },
  { id: 'r21', ...calculateReservation('c21', [54, 55], subDays(new Date(), 2), 27) },
  { id: 'r22', ...calculateReservation('c22', [62, 63, 64], subDays(new Date(), 19), 52) },
  { id: 'r23', ...calculateReservation('c23', [69, 70], subDays(new Date(), 7), 31) },
  { id: 'r24', ...calculateReservation('c24', [77, 78, 79, 80], subDays(new Date(), 4), 44) },
  { id: 'r25', ...calculateReservation('c25', [84, 85], subDays(new Date(), 10), 26) },
  { id: 'r26', ...calculateReservation('c1', [91, 92], subDays(new Date(), 1), 19) },
  { id: 'r27', ...calculateReservation('c3', [7], subDays(new Date(), 17), 47) },
  { id: 'r28', ...calculateReservation('c5', [14], subDays(new Date(), 8), 36) },
  { id: 'r29', ...calculateReservation('c7', [21], subDays(new Date(), 6), 29) },
  { id: 'r30', ...calculateReservation('c9', [28, 29], subDays(new Date(), 15), 41) },
  { id: 'r31', ...calculateReservation('c11', [36, 37], subDays(new Date(), 2), 23) },
  { id: 'r32', ...calculateReservation('c13', [42, 43, 44], subDays(new Date(), 11), 34) },
  { id: 'r33', ...calculateReservation('c15', [56, 57], subDays(new Date(), 3), 21) },
  { id: 'r34', ...calculateReservation('c17', [65, 66], subDays(new Date(), 12), 39) },
  { id: 'r35', ...calculateReservation('c19', [71, 72, 73], subDays(new Date(), 5), 32) },
  { id: 'r36', ...calculateReservation('c21', [81], subDays(new Date(), 9), 24) },
  { id: 'r37', ...calculateReservation('c23', [86, 87], subDays(new Date(), 4), 37) },
  { id: 'r38', ...calculateReservation('c2', [93, 94, 95], subDays(new Date(), 14), 46) },
  { id: 'r39', ...calculateReservation('c4', [96, 97], subDays(new Date(), 1), 17) },
  { id: 'r40', ...calculateReservation('c6', [98, 99, 100], subDays(new Date(), 10), 43) },
];

// Generate all 100 spaces
export const generateSpaces = (): Space[] => {
  const spaces: Space[] = [];
  const reservedSpaceMap = new Map<number, { reservationId: string; clientId: string; endDate: Date }>();

  // Map reserved spaces
  mockReservations.forEach((reservation) => {
    reservation.spaceIds.forEach((spaceId) => {
      reservedSpaceMap.set(spaceId, {
        reservationId: reservation.id,
        clientId: reservation.clientId,
        endDate: reservation.endDate,
      });
    });
  });

  // Create all 100 spaces
  for (let i = 1; i <= 100; i++) {
    const section = i <= 25 ? 'A' : i <= 50 ? 'B' : i <= 75 ? 'C' : 'D';

    if (reservedSpaceMap.has(i)) {
      const reservation = reservedSpaceMap.get(i)!;
      const daysUntilExpiry = Math.ceil((reservation.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      spaces.push({
        id: i,
        status: daysUntilExpiry <= 7 ? 'expiring-soon' : 'reserved',
        reservationId: reservation.reservationId,
        clientId: reservation.clientId,
        section,
      });
    } else {
      spaces.push({
        id: i,
        status: 'available',
        section,
      });
    }
  }

  return spaces;
};
