# Decisiones del proyecto

## Fase 1: base, diseño, onboarding e Inicio

- Se reutilizó el avance existente del repositorio en lugar de reiniciar el proyecto. Se conservaron las 40 palabras académicas y los 12 temas originales de Writing; se descartaron las pantallas de ejemplo y los componentes del scaffold que no aportaban.
- Expo Router organiza las pantallas en `src/app/`. Las cuatro tabs viven en `src/app/(tabs)/`: Inicio, Vocabulario, Writing y Progreso. Onboarding y Ajustes quedan fuera de las tabs.
- Se usa el componente `Tabs` de Expo Router en lugar de `NativeTabs` para mantener el mismo comportamiento en Android, iOS y web.
- La interfaz está en español; el contenido de práctica (palabras, definiciones y consignas) está en inglés.
- La dirección visual sigue `docs/mockups/referencia-1.png` y `docs/mockups/referencia-2.png`: fondo gris muy claro, tarjetas blancas con borde sutil, radios de 16–20 px, azul principal, verde para completado y ámbar para advertencias.
- Se fijó **tema claro** y se retiró la variante oscura del scaffold. Los mockups y el alcance del MVP no requieren modo oscuro; eliminarlo reduce trabajo de revisión visual.
- La tipografía es la del sistema, con jerarquías centralizadas en `src/theme/typography.ts`. El contenido se limita a 560 px de ancho en pantallas amplias.
- Se implementó un editor básico de banda y fecha en Ajustes durante la Fase 1 para que la navegación desde Inicio no termine en una pantalla sin función. El recordatorio local y el borrado de datos se completan en la Fase 4.

## Modelo de datos

- Los modelos se alinearon con el alcance: `Profile`, `Word`, `QuizResult`, `Essay`, `DailyActivity` y `AppState`.
- Se subió el esquema a `schemaVersion: 2` y se cambió la clave de almacenamiento a `@ielts-daily/app-state-v2`. No hay migración desde la versión 1 porque no existían datos reales de usuario.
- `Profile.targetBand` acepta valores de 5.0 a 9.0 en incrementos de 0.5. `examDate` es opcional.
- `Word` conserva el contenido semilla (`category`, `partOfSpeech`, `definitionEn`, `meaningEs`, `exampleEn`) y el progreso local (`isSaved`, `status`, `reviewCount`, `lastReviewedAt`).
- `QuizResult` registra fecha local, respuestas y aciertos. `Essay` guarda borrador, texto, palabras, tiempo, criterios y banda estimada. `DailyActivity` usa una fecha local `YYYY-MM-DD` y tres tareas.
- Las fechas de calendario se construyen con la zona horaria local del dispositivo para evitar desfases por UTC. Los timestamps se guardan en ISO 8601.
- La racha cuenta días consecutivos con al menos una tarea completada. Si hoy aún no hay actividad, la racha se mantiene desde ayer; si tampoco hubo actividad ayer, es 0.
- La palabra del día se calcula de forma determinista a partir de la fecha local (`YYYYMMDD % cantidad de palabras`).
- Guardar la palabra del día (o marcarla como repaso/dominada) completa la tarea `wordOfDay` de ese día. Desmarcarla no borra el historial de actividad.

## Estado y almacenamiento

- `AppProvider` usa `useReducer` y expone `state`, `dispatch`, `isHydrated` y `resetState`. Es la única fuente de verdad.
- El reducer separa las reglas de negocio (marcar tareas, actualizar progreso de palabras, guardar ensayos) de los componentes visuales.
- Se guarda un único documento JSON validado al leer. Si falta, está corrupto o no coincide con el esquema, se crea un estado inicial seguro.
- Las palabras guardadas se reconcilian con las semillas por `id`, de modo que el contenido puede actualizarse sin perder el progreso.
- AsyncStorage no cifra los datos. Los ensayos son datos locales y no se envían a ningún servidor.
- Borrar datos eliminará la clave v2 y la clave legada v1; las semillas permanecen en la aplicación.

## Contenido semilla

- `words.json` contiene 40 palabras académicas reales con categoría, tipo de palabra, definición en inglés, traducción al español y ejemplo en inglés.
- `writing-prompts.json` contiene 12 consignas originales de Writing Task 2 con categoría temática. No se copiaron preguntas oficiales.
- `writing-guide-questions.json` contiene una pregunta guía en español por cada criterio de autoevaluación.
- Los `id` de las semillas son estables y no deben cambiarse sin una migración.

## Dependencias

- Se conservaron solo las dependencias necesarias: Expo, Expo Router, AsyncStorage, vector icons, safe area, screens, web y los peers requeridos por Expo Router (`expo-constants`, `expo-linking`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`).
- Se añadió `expo-font` como peer obligatorio de `@expo/vector-icons`.
- Se retiraron `@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-image`, `expo-symbols`, `expo-system-ui` y `expo-web-browser` del manifiesto directo.
- No se añadieron librerías de gráficos, estado, formularios ni estilos.

## Entrada de fechas

- No se añadió un selector de fecha nativo para evitar otra dependencia. La fecha se escribe con máscara `DD/MM/AAAA` y se valida como fecha real y futura.
- Si el usuario deja la fecha vacía, Inicio muestra un estado sin cuenta regresiva y un acceso a Ajustes. La cuenta regresiva nunca muestra valores negativos.

## Alcance de esta fase

- Implementado: proyecto base, tema, modelos, reducer, persistencia, onboarding, navegación por tabs, Inicio, edición básica de perfil y pantallas informativas de Vocabulario, Writing y Progreso con datos reales.
- Pendiente: banco de vocabulario interactivo completo, quiz de cinco preguntas, editor de Writing con temporizador, autoevaluación, gráficos de Progreso, recordatorio local y borrado seguro.
- La tarea "Quiz de repaso" de Inicio navega temporalmente a Vocabulario hasta que exista la ruta `/quiz` en la Fase 2. La tarea de Writing navega a la tab con los temas disponibles.

## Verificación de la fase

- `npx tsc --noEmit`: sin errores.
- `npm run lint`: sin errores.
- `npx expo-doctor`: 21/21 comprobaciones correctas.
- `npx expo export --platform web`: exportación estática correcta.
- No se probó en dispositivo físico ni emulador. La comprobación fue estática y de compilación/exportación web.
