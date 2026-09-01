# 09 — Mobile & Responsive Design

Plano para hacer responsive Orbit en pantallas pequeñas (teléfonos / tabletas). Alineado con la dirección estética **"Amanecer cálido"** (ver `04-COMPONENTS.md` / `01-ARCHITECTURE.md`).

## Principio rector

El layout de **flujo** (grids `md:`/`lg:`) ya responde solo en móvil. El trabajo de mobile se concentra en 5 frentes concretos; lo demás ya se está.

## Frente 1 — Navegación (bloqueante)

La sidebar de escritorio es fija `w-60` y obstruye pantallas pequeñas. Se introduce un **bottom nav fijo** en móvil.

- **`Layout.tsx`**
  - Keep `flex min-h-svh`.
  - Envuelve el contenido con padding inferior en móvil para no tapar la barra: `pb-20 md:pb-0`.
  - `Sidebar` pasa a `hidden md:flex`. Se renderiza `Sidebar` (desktop) + nuevo `MobileNav` (móvil) sin duplicar datos.
- **Nuevo `MobileNav.tsx`**
  - `fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-paper/90 backdrop-blur`.
  - 4 links (Dashboard, Companies, Contacts, Stats) como columnas icono+etiqueta.
  - Item activo: punto solar + tinta oscura (`nav-dot`). Badge coral en Dashboard con `pendingCount`.
  - Datos: `useQuery(api.interactions.pendingFollowUps)` (mismo patrón que `Sidebar`).
- **`Sidebar.tsx`**: queda como componente de escritorio (nivel/streak/sign out intactos).

## Frente 2 — Detalles y formularios

Cabeceras y tarjetas que se amontonan en pantallas estrechas.

- **`ContactDetail` / `CompanyDetail`**: cabecera `flex-wrap justify-between` → apilar en móvil:
  `flex-col sm:flex-row sm:items-start sm:justify-between`. Avatar+título arriba; botones Edit/Delete en fila propia debajo.
- **`ContactForm` / `CompanyForm` / `AuthForm`**: `card p-6` → `p-5 sm:p-6`. Asegurar tarjeta con `w-full` dentro del contenedor `max-w-xl mx-auto` (no pegada a bordes).
- Contenedores de detalle (`max-w-2xl/3xl mx-auto`): añadir `w-full` y padding horizontal mínimo consistente con `main`.

## Frente 3 — Dashboard / Stats / Charts / Toasts

- **Dashboard**: widgets ya apilan (`md:grid-cols-2`). Solo revisar `p-5`.
- **Stats**: stat cards `grid-cols-2 md:grid-cols-4` ok; número `text-3xl` ok.
- **`GrowthChart` / `WeeklyChart`** (Recharts): `h-64` → `h-56 sm:h-64` y configurar `interval` / ocultar ticks X para evitar etiquetas agolpadas en móvil.
- **`BadgeGrid`**: ya `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` — ok.
- **`StreakHistory`**: ya `sm:grid-cols-3` — ok.
- **`ToastHost`**: en móvil `bottom-6 right-6` queda tras el bottom nav → `bottom-20 right-4 md:bottom-6 md:right-6`, con `max-w-[calc(100%-2rem)]`.

## Frente 4 — Páginas de listado (filtros)

- **`ContactsPage` / `CompaniesPage`**: selects/será `w-full sm:w-auto` (ya presente). Cabecera + botón "+ Add" apilados en móvil (`flex-col`).
- Verificar que los inputs de búsqueda no desborden en móvil.

## Frente 5 — Login

- `AuthGuard` ya centra con `px-4 py-10` y `overflow-hidden`; los anillos orbitales se recortan correctamente. Sin cambios.

## Fuera de alcance

- No se tocan backends (`convex/`) ni archivos generados.
- No hay librerías nuevas de navegación/drawer.

## Verificación

- `npm run build` (typecheck + bundle) tras cada etapa.
- Revisión visual con `npm run dev` (backend Convex en `:3210`).
- Sin framework de tests configurado (`06-ROADMAP.md`).
