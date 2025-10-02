# FreezeStore - Sistema de Gestión de Bodega de Congelados

Sistema web completo para la gestión de espacios de almacenamiento en bodega de productos congelados.

## 🚀 Características Principales

### 📊 Dashboard Interactivo
- KPIs en tiempo real (ocupación, disponibilidad, ingresos)
- Gráficos de ocupación por sección
- Distribución de espacios (pie chart)
- Top 5 clientes por espacios rentados

### 🗺️ Mapa de Espacios
- Grid visual de 100 espacios organizados en 4 secciones (A, B, C, D)
- Código de colores:
  - 🟢 Verde: Disponible
  - 🔴 Rojo: Reservado
  - 🟡 Amarillo: Próximo a vencer (≤7 días)
- Vista detallada de cada espacio con información del cliente
- Filtros por estado

### 👥 Gestión de Clientes
- Registro de clientes con datos fiscales (RFC)
- Búsqueda rápida por nombre, RFC o email
- Historial completo de reservaciones por cliente
- Estadísticas de clientes activos

### 📅 Sistema de Reservaciones
- Wizard paso a paso para crear reservaciones
- **Sugerencia Inteligente de Espacios**: algoritmo que encuentra automáticamente los mejores espacios disponibles (preferentemente contiguos)
- Selección manual o asistida de espacios
- Cálculo automático de costos (almacenamiento + maniobra + IVA)
- Extensión de estadías
- Renovación de reservaciones
- Filtros por estado (activas, vencidas, completadas)

### 🧾 Generación de Tickets
- Tickets profesionales de cobro con desglose completo
- Exportación a PDF con diseño profesional
- Función de impresión
- Información detallada del cliente y reservación

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Icons**: Lucide React
- **Date Management**: date-fns

## 📦 Instalación

```bash
# Navegar a la carpeta
cd bodega-congelados

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🎨 Estructura del Proyecto

```
bodega-congelados/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizables
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   └── Layout.tsx       # Layout principal con navegación
│   ├── context/
│   │   └── AppContext.tsx   # Estado global de la aplicación
│   ├── data/
│   │   └── mockData.ts      # Datos simulados (clientes, reservaciones)
│   ├── pages/
│   │   ├── Dashboard.tsx    # Dashboard con KPIs y gráficos
│   │   ├── Spaces.tsx       # Mapa de espacios interactivo
│   │   ├── Clients.tsx      # Gestión de clientes
│   │   ├── Reservations.tsx # Lista de reservaciones
│   │   ├── NewReservation.tsx # Wizard de nueva reservación
│   │   └── Tickets.tsx      # Generación de tickets
│   ├── types/
│   │   └── index.ts         # Definiciones de tipos TypeScript
│   ├── App.tsx              # Componente principal con routing
│   └── main.tsx             # Entry point
├── tailwind.config.js
├── package.json
└── README.md
```

## 💰 Configuración de Precios

Los precios se configuran en `src/data/mockData.ts`:

```typescript
export const pricingConfig = {
  pricePerDayPerSpace: 150,  // Precio por día por espacio
  handlingFee: 500,          // Tarifa de maniobra (carga/descarga)
  taxRate: 0.16,             // IVA 16%
};
```

## 📊 Datos Mock

El sistema incluye datos simulados para demo:
- **25 clientes** frecuentes con información completa
- **40 reservaciones** activas con diferentes estados
- **100 espacios** distribuidos en 4 secciones

## 🎯 Funcionalidades Especiales

### Sugerencia Inteligente de Espacios
Al crear una nueva reservación, el sistema puede sugerir automáticamente los mejores espacios:
1. Prioriza espacios contiguos para facilitar operaciones
2. Optimiza la ubicación según disponibilidad
3. Considera la cantidad solicitada y el periodo

### Indicadores de Vencimiento
- Espacios con reservaciones próximas a vencer (≤7 días) se marcan en amarillo
- Notificaciones visuales en el dashboard
- Alertas en la lista de reservaciones

### Cálculo Automático de Costos
- Almacenamiento: espacios × días × tarifa diaria
- Maniobra: tarifa fija de carga/descarga
- IVA: 16% sobre subtotal
- Desglose completo en tickets

## 🎨 Tema Visual

Diseño moderno con paleta de colores fríos que representa el ambiente de congelados:
- **Azules** (ice-*): Color principal del sistema
- **Blancos**: Limpieza y claridad
- **Verdes**: Disponibilidad y éxito
- **Rojos**: Ocupación y alertas
- **Amarillos**: Advertencias

## 📱 Responsive Design

El sistema es completamente responsive:
- **Desktop**: Experiencia completa con todos los detalles
- **Tablet**: Navegación optimizada
- **Mobile**: Funcional con elementos adaptados

## 🚀 Próximos Pasos (Backend)

Para conectar con un backend real:

1. Reemplazar `AppContext` con llamadas API
2. Implementar autenticación de usuarios
3. Persistencia de datos en base de datos
4. Sistema de notificaciones por email
5. Dashboard de administración avanzado
6. Reportes y analytics
7. Integración con sistemas de facturación

## 📄 Licencia

Proyecto de demostración - Todos los derechos reservados

---

**Nota**: Este es un frontend completamente funcional con datos simulados. Listo para presentación en demo y posterior integración con backend.
