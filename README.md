# Stock de Almacenes (Gerdau - Siderperú)

Aplicación web para la coordinación en tiempo real entre **Despacho (Almacén)** y **Balanza** para el control de medidas de barras de acero por almacén (`PT 08`, `PT 09`, `PT 15 - BAHIA`, `PT 15 - CURVA`).

## Características Principales

- **Vista Principal (`/`):** Selección de rol entre **Despachador** y **Balanza**.
- **Panel del Despachador (`/despachador`):** Modo edición con columnas fijas, selectores desplegables con filtro integrado ordenados estrictamente de **delgado a grueso**, reloj en vivo (`Hora de modificación`), modal de medidas personalizadas y botón inferior derecho **Confirmado / Verificado**.
- **Monitor de Balanza (`/balanza`):** Modo **100% solo lectura** con indicador estático `Última modificación` (actualizado al confirmar en Despachador), buscador rápido para picking SAP (ej. `1/2 x 9`), chips de acceso rápido y animación en tiempo real al recibir confirmaciones.
- **Sincronización Multi-Dispositivo en Vercel (`/api/stock` + Upstash Redis):**
  - Entre pestañas del mismo navegador: `BroadcastChannel API` + `localStorage`.
  - Entre distintos navegadores, PCs o celulares: función serverless [`api/stock.ts`](./api/stock.ts) conectada a **Upstash Redis** con sondeo automático cada 3 segundos y recarga instantánea al enfocar la pestaña.

## Activar sincronización entre distintos navegadores/dispositivos en Vercel

1. En tu proyecto dentro del dashboard de **Vercel**, ve a la pestaña **Storage** (o **Integrations**).
2. Haz clic en **Create Database** -> selecciona **Upstash** -> **Upstash for Redis** (plan gratuito) y conéctala al proyecto.
3. Vercel inyectará automáticamente `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL` / `KV_REST_API_TOKEN`).
4. Haz **Redeploy** en Vercel (o un nuevo `git push`). Desde ese momento verás el badge **`Nube activa · Multi-dispositivo`** / **`Sincronizado en la nube`** y todos los dispositivos compartirán el mismo stock.

## Desarrollo Local y Verificación

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```
