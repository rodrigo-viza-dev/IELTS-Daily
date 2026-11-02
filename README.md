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
8. Ajustes con edición de perfil, recordatorio local y borrado seguro.

## Stack y dependencias principales

- Expo SDK 57, React Native 0.86, TypeScript estricto.
- Expo Router (`src/app/`).
- AsyncStorage para persistencia local.
- Context + `useReducer` para el estado.
- `@expo/vector-icons` para iconos.
- `expo-notifications` para el recordatorio local.
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

Para Android o iOS usa Expo Go o un development build compatible con Expo SDK 57. El recordatorio local puede requerir un development build; la app lo informa y no simula que está activo si falla.

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
- `src/utils/`: fechas, rachas, bandas, palabra del día, quiz y notificaciones.
- `docs/`: mockups y decisiones.

## Persistencia

Se guarda un único documento JSON versionado (`schemaVersion: 2`) en AsyncStorage bajo `@ielts-daily/app-state-v2`. Al leer se valida el esquema y se reconcilian las palabras semilla con el progreso guardado. Si el documento no existe o está corrupto, se crea un estado inicial seguro.

Los datos no se cifran ni se envían a un servidor: permanecen en el dispositivo. Borrar datos elimina el documento local y cancela los recordatorios programados.

## Notificaciones

- Se pide permiso solo al activar el recordatorio.
- En web los recordatorios locales no están disponibles; Ajustes lo explica y desactiva el control.
- Si el entorno no permite programar la notificación, se muestra un error y se sugiere un development build. No se muestra el recordatorio como activo.
- El recordatorio es local y diario; no se usan notificaciones push remotas.

## Limitación de la autoevaluación

La banda calculada es una autoestimación basada en los cuatro criterios y la percepción del propio usuario. No es una corrección automática, no usa IA y no garantiza una banda oficial.

## Verificación realizada

- `npx tsc --noEmit`: sin errores.
- `npm run lint`: sin errores.
- `npx expo-doctor`: 21/21 comprobaciones correctas.
- `npx expo export --platform web`: exportación estática correcta con 14 rutas.
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
- El recordatorio local depende del permiso del sistema y de un entorno compatible.
- La prueba en dispositivo físico queda pendiente.
