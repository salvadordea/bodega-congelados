# 🚀 Instrucciones de Inicio Rápido

## Para iniciar el proyecto:

```bash
cd bodega-congelados
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

## Navegación del Sistema:

### 1. **Dashboard** (`/`)
- Vista general con KPIs
- Gráficos de ocupación
- Top clientes

### 2. **Espacios** (`/spaces`)
- Mapa interactivo de 100 espacios
- Click en cualquier espacio para ver detalles
- Filtros por estado

### 3. **Clientes** (`/clients`)
- Lista de clientes
- Click para ver historial completo
- Botón "Nuevo Cliente" para agregar

### 4. **Reservaciones** (`/reservations`)
- Lista de todas las reservaciones
- Filtros por estado
- Botón "Nueva Reservación" para crear
- Click en reservación para extender o eliminar

### 5. **Nueva Reservación** (desde botón en `/reservations`)
- **Paso 1**: Seleccionar cliente
- **Paso 2**: Configurar duración y espacios
- **Paso 3**: Seleccionar espacios (usar "Sugerencia Inteligente" ✨)
- **Paso 4**: Revisar y confirmar

### 6. **Tickets** (`/tickets`)
- Seleccionar reservación
- Ver preview del ticket
- Descargar PDF o Imprimir

## ✨ Características Destacadas para la Demo:

1. **Sugerencia Inteligente**: En nueva reservación, paso 3, click en "Sugerencia Inteligente" para ver cómo selecciona espacios contiguos automáticamente

2. **Dashboard Interactivo**: Los gráficos muestran datos en tiempo real

3. **Código de Colores**:
   - 🟢 Verde = Disponible
   - 🔴 Rojo = Reservado
   - 🟡 Amarillo = Vence en ≤7 días

4. **Tickets Profesionales**: Exportación a PDF con diseño completo

5. **Búsqueda y Filtros**: Todas las vistas tienen búsqueda en tiempo real

## 💡 Tips para la Demo:

- Mostrar primero el Dashboard para impresionar con las métricas
- Demostrar el mapa de espacios interactivo
- Crear una nueva reservación usando la sugerencia inteligente
- Generar un ticket en PDF para mostrar la funcionalidad completa
- Destacar el diseño moderno y responsive

## 🎨 Datos Precargados:

- 25 clientes activos
- 40 reservaciones en diferentes estados
- ~60 espacios ocupados de 100 totales
