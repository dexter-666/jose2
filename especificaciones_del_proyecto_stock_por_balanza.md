# Especificación de Proyecto Web: Sistema de Control de "Stock por Balanza / Almacén" (Gerdau - Siderperú)

Actúa como un Desarrollador Full-Stack Senior y Diseñador UI/UX experto. Necesito que construyas una aplicación web interactiva, moderna, bien estructurada y con animaciones fluidas para la gestión y visualización en tiempo real del stock de productos siderúrgicos por almacén/balanza para las empresas **Gerdau** y **Siderperú**.

---

## 1. Objetivo del Sistema y Flujo de Negocio
El sistema resuelve la comunicación entre el área de **Despacho (Almacén)** y el área de **Balanza**. 
- Cuando llega un camión/chofer con su hoja de *picking* (solicitud de pedido SAP), el operador de **Balanza** necesita saber en qué almacén físico se encuentra disponible la medida del material solicitado.
- El **Despachador** tiene acceso a un panel editable donde actualiza qué medidas de productos están activas/disponibles en cada uno de los 4 almacenes.
- La vista de **Balanza** actúa como un monitor en tiempo real (solo lectura / no modificable) que refleja instantáneamente los cambios realizados por el Despachador.

---

## 2. Identidad Visual, UI/UX y Animaciones
* **Colores Corporativos:**
  * **Siderperú:** Rojo intenso (`#E30613` / `#D32F2F`), Amarillo/Ámbar para acentos e indicadores (`#FFB600` / `#FFC107`).
  * **Gerdau:** Azul corporativo profundo (`#003366` / `#004B87`).
  * **Fondos y Superficies:** Blanco puro (`#FFFFFF`), gris muy claro para fondos de paneles (`#F4F6F8`), y bordes limpios en gris suave (`#E0E0E0`).
* **Cabecera Persistente (Header):**
  * En todas las vistas debe aparecer el logo de **GERDAU** en la esquina superior izquierda y el logo de **SIDERPERU** en la esquina superior derecha.
  * Botón discreto y elegante para "Volver al Inicio" o cambiar de vista cuando se esté dentro de Despachador o Balanza.
* **Estilo de Menús Desplegables (Dropdowns) y Animaciones:**
  * Inspirado en el diseño web de Siderperú: los selectores/filtros deben tener un diseño llamativo (cabecera en color rojo o azul corporativo con texto blanco y una flecha triangular amarilla).
  * Al desplegarse, debe animarse suavemente (`fade-in` + `slide-down` con `cubic-bezier`) mostrando un pequeño triángulo amarillo apuntando hacia arriba que conecta el botón con la lista blanca de opciones.
  * Transiciones de página suaves al cambiar entre la pantalla Principal, Despachador y Balanza.
  * Animación tipo *pulse* o *highlight* suave en la vista de Balanza cada vez que un ítem nuevo es agregado o modificado por el Despachador.

---

## 3. Estructura de Vistas (Pantallas)

### VISTA 1: Página Principal (Landing / Selección de Rol)
* **Diseño:** Centrado, limpio, con tarjetas o botones de gran tamaño e impacto visual.
* **Título Central:** `"Stock por balanza"` (o `"Stock por Almacén"` como subtítulo secundario).
* **Opciones (2 Botones Principales con efectos *hover* de elevación):**
  1. **Botón Izquierdo:** `Despachador` (Icono de edición/almacén) -> Lleva a la Vista 2.
  2. **Botón Derecho:** `Balanza` (Icono de monitor/balanza/camión) -> Lleva a la Vista 3.

---

### VISTA 2: Panel del Despachador (Modo Editable)
* **Restricción Visual:** Mostrar un badge o indicador de estado que diga `"Modo Edición - Despachador"`.
* **Estructura de Tabla / Tablero (4 Columnas Fijas):**
  Las cabeceras de las columnas **NO son modificables** y deben ser exactamente:
  1. `PT 08`
  2. `PT 09`
  3. `PT 15 - BAHIA`
  4. `PT 15 - CURVA`
* **Funcionalidad dentro de cada columna:**
  * El despachador puede agregar múltiples filas/ranuras de productos disponibles en cada columna (por ejemplo, botón `"+ Agregar medida"` o varias casillas con listas desplegables en cascada).
  * **Selector con Filtro (Dropdown):** Cada casilla tiene un menú desplegable (con buscador/filtro integrado) donde el despachador escoge la medida del producto que hay en ese lugar.
  * **Ordenamiento Estricto:** La lista de medidas dentro del selector debe estar ordenada automáticamente **de delgado a grueso** (menor a mayor diámetro/espesor y longitud).
  * **Acciones:** Permitir cambiar la medida seleccionada en cualquier momento o eliminar/limpiar una casilla si el producto se agotó en ese almacén.
  * **Control de Turno / Hora (Opcional pero recomendado según pizarra):** Mostrar un indicador de última actualización (ej. Turno 7:00 AM, 3:00 PM, 11:00 PM o la hora exacta del último cambio) y un botón de `"Verificar / Actualizar Stock"` (o guardado automático instantáneo).

---

### VISTA 3: Panel de Balanza (Modo Solo Lectura / No Modificable)
* **Restricción Estricta:** Esta vista es **100% NO MODIFICABLE** (Solo lectura). Ningún usuario en esta pantalla puede editar, borrar ni abrir selectores para cambiar datos.
* **Estructura de Tabla / Tablero (Las mismas 4 Columnas Fijas):**
  1. `PT 08`
  2. `PT 09`
  3. `PT 15 - BAHIA`
  4. `PT 15 - CURVA`
* **Visualización de Datos:**
  * Debajo de cada columna se muestran en tarjetas limpias (`Badges` o cajas de texto estáticas tituladas `"Tipos de medida"`) únicamente los productos que el Despachador haya asignado a ese almacén.
  * Igualmente ordenados de **delgado a grueso** para lectura rápida del operador de balanza.
  * Debe incluir un buscador rápido en la parte superior (filtro de vista) para que el operador de balanza pueda escribir, por ejemplo, `"1/2 x 9"` y se resalten o filtren las columnas que contienen esa medida.

---

## 4. Catálogo de Datos Iniciales (Medidas de Productos)
Precargar el sistema con las medidas estándar de barras de acero / fierros (ordenadas de **delgado a grueso** según diámetro y longitud) vistas en el levantamiento de información:

1. `6 mm`
2. `8 mm`
3. `3/8" x 9 m`
4. `3/8" x 12 m`
5. `12 mm`
6. `1/2" x 9 m`
7. `1/2" x 12 m`
8. `5/8" x 9 m`
9. `5/8" x 12 m`
10. `3/4" x 9 m`
11. `3/4" x 12 m`
12. `1" x 9 m`
13. `1" x 12 m`

*(Incluir una pequeña opción en el modo Despachador para agregar una nueva medida personalizada al catálogo si fuera necesario).*

---

## 5. Requerimientos Técnicos de Sincronización
* **Estado Compartido en Tiempo Real:** Si se abren dos pestañas del navegador (una en la vista `Despachador` y otra en la vista `Balanza`), cualquier cambio que haga el Despachador debe reflejarse **instantáneamente sin recargar la página** en la vista de Balanza (utilizando `localStorage` con el evento `storage` o `BroadcastChannel API` en el Frontend, o preparado para WebSockets/Supabase/Firebase).
* **Diseño Responsivo:** Debe verse impecable tanto en monitores industriales panorámicos (1080p) como en tablets o laptops de almacén.
* **Código Limpio y Modular:** Estructurar correctamente los componentes, estados, animaciones CSS y manejo de datos.