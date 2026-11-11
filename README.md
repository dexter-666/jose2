# Stock de Almacenes (Gerdau - Siderperú)

Aplicación web para la coordinación en tiempo real entre **Despacho (Almacén)** y **Balanza** para el control de medidas de barras de acero por almacén (`PT 08`, `PT 09`, `PT 15 - BAHIA`, `PT 15 - CURVA`).

## Sincronización Multi-Dispositivo (Recomendado: Firebase Realtime Database)

Para que cualquier cambio confirmado en **Despachador** aparezca al instante en el navegador de otros usuarios o pantallas sin límites de consultas por segundo:

1. Entra a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto gratuito.
2. En el menú lateral (**Build / Compilación**) → **Realtime Database** → **Crear base de datos**.
3. Elige la ubicación (ej. `Estados Unidos (us-central1)`), inicia en **Modo de prueba** y haz clic en **Habilitar**.
4. Ve a la pestaña **Reglas** de tu Realtime Database y pega estas reglas (para que no caduquen a los 30 días):
   ```json
   {
     "rules": {
       "gerdau_siderperu_stock_v1": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```
   Presiona **Publicar**.
5. En la pestaña **Datos**, copia la URL superior de tu base (ej. `https://tu-proyecto-default-rtdb.firebaseio.com`).
6. En tu proyecto de **Vercel** → **Settings** → **Environment Variables**, agrega:
   - **Name:** `VITE_FIREBASE_DATABASE_URL`
   - **Value:** *(la URL que copiaste)*
7. Haz **Redeploy** en Vercel. Verás el indicador **`Firebase en vivo · Multi-dispositivo`** en Despachador y **`Firebase en vivo · Tiempo real`** en Balanza.

*(Nota: también mantiene respaldo con `BroadcastChannel` + `localStorage` para pestañas locales y soporte opcional para Upstash Redis vía `/api/stock`).*

## Desarrollo Local y Verificación

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```
