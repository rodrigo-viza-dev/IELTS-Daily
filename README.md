# IELTS Daily

Aplicación móvil offline-first para preparar IELTS con sesiones cortas y medibles. Está construida con Expo, React Native, TypeScript y Expo Router.

> Estado actual: Fase 1 completada (base, tema, persistencia, onboarding e Inicio). Vocabulario, quiz, Writing, Progreso y Ajustes se completan en las fases siguientes. Consulta `docs/DECISIONES.md`.

## Propósito

Convertir una preparación autónoma irregular en una rutina diaria breve: una palabra, un quiz y una práctica de Writing, con racha, cuenta regresiva y progreso derivado de la actividad real del usuario.

La autoevaluación de Writing es **orientativa** y no reemplaza una calificación oficial de IELTS.

## Stack

- Expo SDK 57, React Native 0.86 y TypeScript estricto.
- Expo Router con rutas en `src/app/`.
- AsyncStorage para persistencia local.
- Context + `useReducer` para el estado.
- `@expo/vector-icons` para iconos.
- `expo-notifications` se integrará en la fase de Ajustes.

## Instalación y ejecución

```bash
npm install
npx expo start
```

Para web, presiona `w` en la terminal de Expo o ejecuta:

```bash
npm run web
```

Para Android o iOS usa Expo Go o un development build compatible con Expo SDK 57. Las notificaciones locales requieren un development build; se explicará en la fase de Ajustes.

## Verificación

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo export --platform web
```

## Estructura

- `src/app/`: rutas de Expo Router. Tabs en `src/app/(tabs)/`; onboarding, quiz y Writing fuera de las tabs.
- `src/components/`: componentes visuales reutilizables.
- `src/context/`: estado global, acciones y reducer.
- `src/data/seed/`: contenido semilla en JSON (palabras, temas y preguntas guía).
- `src/storage/`: carga, validación y persistencia versionada.
- `src/theme/`: colores, tipografía, espaciado, radios y sombras.
- `src/types/`: modelos de dominio.
- `src/utils/`: reglas de fechas, rachas, bandas y palabra del día.
- `docs/`: mockups de referencia y decisiones del proyecto.

## Persistencia

Se guarda un único documento JSON versionado en AsyncStorage bajo la clave `@ielts-daily/app-state-v2`. Al leer, se valida el esquema y se reconcilian las palabras semilla con el progreso guardado. Si el documento no existe o está corrupto, se crea un estado inicial.

Los datos no se cifran ni se envían a un servidor: permanecen en el dispositivo.

## Limitaciones conocidas

- Sin login, backend, sincronización ni servicios de IA.
- La autoevaluación es una autoestimación, no una corrección profesional.
- Las notificaciones locales no funcionan en todos los entornos; se informará al usuario y no se simulará que están activas.
