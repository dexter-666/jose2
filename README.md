# Stock por Balanza / Almacén (Gerdau - Siderperú)

Aplicación web para la coordinación en tiempo real entre **Despacho (Almacén)** y **Balanza** en el despacho de barras de acero / fierros por almacén (`PT 08`, `PT 09`, `PT 15 - BAHIA`, `PT 15 - CURVA`).

## Características Principales

- **Vista Principal (`/`):** Selección de rol entre **Despachador** y **Balanza**, con resumen de stock por almacén y turno activo.
- **Panel del Despachador (`/despachador`):** Modo edición con columnas fijas, selectores desplegables con filtro integrado ordenados estrictamente de **delgado a grueso**, gestión de medidas personalizadas, selector de turno (`7:00 AM`, `3:00 PM`, `11:00 PM`) y botón **Verificar / Actualizar Stock**.
- **Monitor de Balanza (`/balanza`):** Modo **100% solo lectura** con buscador rápido para picking SAP (ej. `1/2 x 9`), chips de acceso rápido, resaltado automático de almacenes coincidentes y animación *pulse* en tiempo real cuando Despacho actualiza el stock.
- **Sincronización en Tiempo Real:** Utiliza `BroadcastChannel API` + `localStorage` (`storage` event) para reflejar cambios al instante entre pestañas del navegador sin recargar la página (arquitectura modular en `src/services/stockSync.ts` lista para conectar Supabase/Firebase si se requiere sincronización entre distintos dispositivos).

## Desarrollo Local

```bash
npm install
npm run dev
```

## Verificación

```bash
npm test
npm run lint
npm run build
```

## Despliegue en Vercel

El proyecto incluye `vercel.json` configurado para Vite y rutas SPA (`/despachador`, `/balanza`):

1. Sube este repositorio a GitHub / GitLab / Bitbucket e impórtalo en **Vercel** (detecta Vite automáticamente), **o**
2. Ejecuta directamente desde la terminal:
   ```bash
   npx vercel --prod
   ```

