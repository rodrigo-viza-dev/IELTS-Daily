# IELTS Daily

MVP móvil offline-first para preparar IELTS con una rutina diaria breve y medible. Construido con Expo, React Native, TypeScript y Expo Router.

## Propósito

Convertir una preparación autónoma irregular en una rutina sostenible: una palabra, un quiz y una práctica de Writing por día, con racha, cuenta regresiva y progreso derivado de la actividad real del usuario.

La autoevaluación de Writing es **orientativa** y no reemplaza una calificación oficial de IELTS.

## Funciones incluidas

1. Onboarding con banda objetivo (5.0–9.0) y fecha de examen opcional.
2. Inicio con cuenta regresiva, racha, tareas del día y acceso a Ajustes.
3. Vocabulario con palabra del día, banco de 40 palabras, guardados y estados.
4. Quiz de 5 preguntas con cuatro opciones, retroalimentación y resultado.
5. Writing Task 2 con 12 temas, editor, temporizador de 40 minutos, conteo de palabras y borrador persistente.
6. Autoevaluación con los 4 criterios de IELTS, escala 1–9 y banda estimada redondeada a 0.5.
7. Progreso con rachas, actividad semanal, totales y evolución de ensayos.
8. Ajustes con edición de perfil, borrado seguro y recordatorio diferido.

## Stack y dependencias principales

- Expo SDK 57, React Native 0.86, TypeScript estricto.
- Expo Router (`src/app/`).
- AsyncStorage para persistencia local.
- Context + `useReducer` para el estado.
- `@expo/vector-icons` para iconos.
- Gráficos con `View` y estilos, sin librerías externas.

## Instalación y ejecución

```bash
npm install
npx expo start
```

Para web:

```bash
npm run web
```

Para Android o iOS usa Expo Go o un development build compatible con Expo SDK 57. Esta versión no incluye recordatorios locales; la app abre sin ese módulo.

## Comandos de verificación

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo export --platform web
```

## Rutas

- `/onboarding`: configuración inicial.
- `/(tabs)` → `/`: Inicio.
- `/(tabs)/vocabulary`: Vocabulario.
- `/(tabs)/writing`: lista de temas de Writing.
- `/(tabs)/progress`: Progreso.
- `/quiz`: ronda de repaso.
- `/writing/[id]`: editor de un tema.
- `/settings`: Ajustes.

## Estructura

- `src/app/`: rutas de Expo Router.
- `src/components/`: componentes visuales reutilizables.
- `src/context/`: estado global, acciones y reducer.
- `src/data/seed/`: palabras, temas y preguntas guía en JSON.
- `src/storage/`: carga, validación y persistencia versionada.
- `src/theme/`: colores, tipografía, espaciado, radios y sombras.
- `src/types/`: modelos de dominio.
- `src/utils/`: fechas, rachas, bandas, palabra del día y quiz.
- `docs/`: mockups y decisiones.

## Persistencia

Se guarda un único documento JSON versionado (`schemaVersion: 2`) en AsyncStorage bajo `@ielts-daily/app-state-v2`. Al leer se valida el esquema y se reconcilian las palabras semilla con el progreso guardado. Si el documento no existe o está corrupto, se crea un estado inicial seguro.

Los datos no se cifran ni se envían a un servidor: permanecen en el dispositivo. Borrar datos elimina el documento local.

## Recordatorios

- Los recordatorios locales quedaron **diferidos para el final**. En Expo Go SDK 57 la carga de `expo-notifications` impedía abrir la app, así que se retiró el módulo del arranque y de Ajustes para mantener el MVP funcional.
- Ajustes muestra una nota de que la función está pendiente; no hay interruptor ni simulación de recordatorio activo.
- Los campos `reminderEnabled` y `reminderTime` se conservan en el perfil para una futura integración, pero no se editan en esta versión.
- Cuando se retome, se usará una notificación local diaria, se pedirá permiso solo al activarla y se probará en un development build.

## Limitación de la autoevaluación

La banda calculada es una autoestimación basada en los cuatro criterios y la percepción del propio usuario. No es una corrección automática, no usa IA y no garantiza una banda oficial.

## Verificación realizada

- `npx tsc --noEmit`: sin errores.
- `npm run lint`: sin errores.
- `npx expo-doctor`: 21/21 comprobaciones correctas.
- `npx expo export --platform web`: exportación estática correcta con 14 rutas.
- `npx expo export --platform android`: bundle de Android correcto sin `expo-notifications`.
- Lógica de bandas, fechas, rachas, palabra del día, quiz y reducer comprobada con `tsx`.
- No se probó en dispositivo físico ni emulador. La verificación fue estática, de compilación/exportación web y de lógica pura. Las pruebas interactivas quedan para el entorno del usuario.

## Recorridos para probar

1. Primera apertura → Onboarding → Inicio.
2. Guardar dos veces una palabra → no se duplica.
3. Completar quiz → resultado y actividad visibles en Progreso.
4. Ensayo con menos de 250 palabras → advertencia visible.
5. Criterios 6, 7, 7 y 8 → promedio orientativo 7.0.
6. Cerrar y reabrir → perfil, borrador, palabras y ensayos persisten.
7. Cambiar fecha del examen → cuenta regresiva actualizada.
8. Borrar datos → cancelar conserva; confirmar restablece.
9. Móvil y web → sin desbordamientos, contenido inaccesible ni botones muertos.

El detalle de pasos, resultados esperados y estado de cada recorrido está en `docs/PRUEBAS.md`.

## Capturas sugeridas

Onboarding, Inicio con cuenta regresiva, Vocabulario, Quiz con retroalimentación, Editor de Writing, Autoevaluación, Progreso y Ajustes.

## Limitaciones pendientes

- Sin login, backend, sincronización, IA, voz, Listening, Reading ni Speaking.
- El recordatorio local queda pendiente para el final por incompatibilidad con Expo Go en esta versión.
- La prueba en dispositivo físico queda pendiente.
