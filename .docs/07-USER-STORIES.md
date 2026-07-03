# 07 — User Stories

## Convenciones

- **Prioridad**: P0 (MVP indispensable), P1 (importante), P2 (nice to have)
- **Esfuerzo**: S (≤2h), M (2-4h), L (4-8h), XL (>8h)
- **Dependencia**: ID de story que debe estar terminada primero

---

## Epic A: Companies (P0)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-01 | Como usuario, quiero crear una empresa con nombre, sitio web, industria y notas para tener mi listado de empresas relevantes. | P0 | S | — |
| US-02 | Como usuario, quiero editar y eliminar empresas para mantener el listado actualizado. | P0 | S | US-01 |
| US-03 | Como usuario, quiero marcar una empresa como "de interés" para destacar las que más me interesan. | P0 | XS | US-01 |
| US-04 | Como usuario, quiero ver todas las empresas en una lista y filtrar solo las trackeadas para enfocarme. | P0 | S | US-01 |
| US-05 | Como usuario, quiero ver los contactos que tengo en cada empresa para saber mi reach ahí. | P0 | M | US-04, US-07 |

## Epic B: Contacts (P0)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-06 | Como usuario, quiero crear un contacto con nombre, email, LinkedIn, GitHub, rol, empresa, proyectos personales y notas. | P0 | M | US-01 |
| US-07 | Como usuario, quiero asignar un contacto a una empresa existente. | P0 | S | US-06 |
| US-08 | Como usuario, quiero editar y eliminar contactos. | P0 | S | US-06 |
| US-09 | Como usuario, quiero buscar contactos por nombre, empresa o tags. | P0 | M | US-06 |
| US-10 | Como usuario, quiero ver un detalle del contacto con toda su información. | P0 | S | US-06 |
| US-11 | Como usuario, quiero subir una foto de perfil para el contacto (o usar iniciales por defecto). | P1 | M | US-06 |

## Epic C: Interactions (P0)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-12 | Como usuario, quiero registrar una interacción con un contacto (tipo, fecha, notas) para llevar registro de nuestras conversaciones. | P0 | S | US-06 |
| US-13 | Como usuario, quiero ver un timeline de interacciones por contacto ordenado del más reciente al más antiguo. | P0 | S | US-12 |
| US-14 | Como usuario, quiero opcionalmente asignar una fecha de follow-up a una interacción para no perder el seguimiento. | P0 | S | US-12 |
| US-15 | Como usuario, quiero marcar un follow-up como completado. | P0 | XS | US-14 |
| US-16 | Como usuario, quiero ver todos mis follow-ups pendientes destacados en el dashboard. | P0 | M | US-14 |
| US-17 | Como usuario, quiero un badge en la sidebar con la cantidad de follow-ups pendientes. | P0 | S | US-16 |

## Epic D: Tags (P1)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-18 | Como usuario, quiero crear tags con nombre y color para categorizar contactos (ej: "backend", "mentor", "startup"). | P1 | S | — |
| US-19 | Como usuario, quiero asignar y sacar tags a un contacto. | P1 | S | US-18, US-06 |
| US-20 | Como usuario, quiero filtrar contactos por tag. | P1 | S | US-19 |

## Epic E: Dashboard (P0)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-21 | Como usuario, quiero ver un dashboard al entrar que me muestre mi progreso semanal, racha, últimas interacciones y follow-ups. | P0 | M | US-24, US-25, US-16 |
| US-22 | Como usuario, quiero configurar mi meta semanal de interacciones (default 2). | P1 | XS | US-21 |
| US-23 | Como usuario, quiero ver una barra de progreso de mi meta semanal. | P0 | S | US-22 |

## Epic F: Gamification (P1)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-24 | Como usuario, quiero tener una racha (streak) de días consecutivos con interacciones para mantenerme motivado. | P1 | M | US-12 |
| US-25 | Como usuario, quiero ver mi racha actual y mi racha más larga. | P1 | S | US-24 |
| US-26 | Como usuario, quiero subir de nivel (Bronze → Silver → Gold → etc) según la cantidad total de interacciones. | P1 | S | US-12 |
| US-27 | Como usuario, quiero ver mi nivel actual en la sidebar. | P1 | XS | US-26 |
| US-28 | Como usuario, quiero desbloquear logros (achievements) al cumplir hitos específicos. | P1 | M | US-24, US-26, US-15 |
| US-29 | Como usuario, quiero recibir un toast con confetti cuando desbloqueo un logro. | P1 | S | US-28 |

## Epic G: Stats (P1)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-30 | Como usuario, quiero ver un gráfico de crecimiento de contactos a lo largo del tiempo. | P1 | M | US-06 |
| US-31 | Como usuario, quiero ver un gráfico de interacciones por semana. | P1 | M | US-12 |
| US-32 | Como usuario, quiero ver todos mis logros (desbloqueados y bloqueados) en una grilla. | P1 | S | US-28 |
| US-33 | Como usuario, quiero ver tarjetas de resumen: total contacts, total interacciones, racha, empresas trackeadas. | P1 | S | US-24, US-06 |

## Epic H: Aura / Constellation (P2)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-34 | Como usuario, quiero ver un anillo de color alrededor del avatar del contacto que indique qué tan fuerte es la relación. | P2 | S | US-11 |
| US-35 | Como usuario, quiero una vista "constelación" que muestre todos mis contactos orbitando alrededor mío. (v2) | P2 | XL | US-34 |

## Epic I: Extra (P2)

| ID | Story | Prio | Esfuerzo | Dep |
|---|---|---|---|---|
| US-36 | Como usuario, quiero recibir un email cuando tenga follow-ups vencidos. | P2 | L | US-14 |

---

## Resumen de Priorización

| Epic | Stories | Prioridad |
|---|---|---|
| A — Companies | US-01 al US-05 | P0 |
| B — Contacts | US-06 al US-11 | P0 (US-11 es P1) |
| C — Interactions | US-12 al US-17 | P0 |
| E — Dashboard | US-21 al US-23 | P0 |
| D — Tags | US-18 al US-20 | P1 |
| F — Gamification | US-24 al US-29 | P1 |
| G — Stats | US-30 al US-33 | P1 |
| H — Aura | US-34 al US-35 | P2 |
| I — Extra | US-36 | P2 |

MVP (P0) = 16 stories
