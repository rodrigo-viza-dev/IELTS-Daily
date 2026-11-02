# Decisiones del proyecto

## Fase 1: base, diseño, onboarding e Inicio

- Se reutilizó el avance existente del repositorio en lugar de reiniciar el proyecto. Se conservaron las 40 palabras académicas y los 12 temas originales de Writing; se descartaron las pantallas de ejemplo y los componentes del scaffold que no aportaban.
- Expo Router organiza las pantallas en `src/app/`. Las cuatro tabs viven en `src/app/(tabs)/`: Inicio, Vocabulario, Writing y Progreso. Onboarding y Ajustes quedan fuera de las tabs.
- Se usa el componente `Tabs` de Expo Router en lugar de `NativeTabs` para mantener el mismo comportamiento en Android, iOS y web.
- La interfaz está en español; el contenido de práctica (palabras, definiciones y consignas) está en inglés.
- La dirección visual sigue `docs/mockups/referencia-1.png` y `docs/mockups/referencia-2.png`: fondo gris muy claro, tarjetas blancas con borde sutil, radios de 16–20 px, azul principal, verde para completado y ámbar para advertencias.
- Se fijó **tema claro** y se retiró la variante oscura del scaffold. Los mockups y el alcance del MVP no requieren modo oscuro; eliminarlo reduce trabajo de revisión visual.
- La tipografía es la del sistema, con jerarquías centralizadas en `src/theme/typography.ts`. El contenido se limita a 560 px de ancho en pantallas amplias.
- Se implementó un editor básico de banda y fecha en Ajustes durante la Fase 1 para que la navegación desde Inicio no termine en una pantalla sin función. El borrado de datos se completó en la Fase 4; el recordatorio local se intentó y se difirió por incompatibilidad con Expo Go.

## Fase 2: Vocabulario y quiz

- La palabra del día se obtiene del banco local de forma determinista; no se guarda una copia distinta por día.
- Guardar y retirar una palabra alterna un booleano sobre la misma semilla. No se crean duplicados y la lista de guardados se deriva del estado global.
- El estado de aprendizaje es `new`, `review` o `mastered`. Cada respuesta de quiz incrementa `reviewCount`; con dos o más repasos la palabra pasa a `mastered`. El estado se puede revisar en Vocabulario.
- El quiz elige cinco palabras únicas, prioriza las guardadas y completa con el banco local. Cada pregunta usa cuatro opciones tomadas de otras palabras y no repite palabras dentro de la ronda.
- La retroalimentación muestra la respuesta correcta y una explicación breve con la traducción. El resultado se guarda como `QuizResult` y marca la actividad diaria del quiz.
- La tarea de quiz de Inicio navega a `/quiz`. Se añadieron guardas para evitar doble avance por doble pulsación.

## Fase 3: Writing y autoevaluación

- Cada tema tiene como máximo un borrador activo, identificado por el `promptId`. El borrador guarda texto, `startedAt` y segundos transcurridos, de modo que se puede retomar al volver a la pantalla o reabrir la app.
- El temporizador de 40 minutos se calcula con marcas de tiempo, no solo contando intervalos. Admite iniciar, pausar y reanudar; al llegar a cero se detiene y permite enviar a autoevaluación.
- El conteo de palabras usa separación por espacios. Si hay menos de 250 se muestra una advertencia, pero no se bloquea el envío.
- El borrador se persiste con un retardo de 700 ms al escribir, al pausar y al desmontar la pantalla. Al guardar el ensayo se elimina el borrador y se registra la actividad de Writing.
- La autoevaluación se presenta en un modal con los cuatro criterios oficiales, una pregunta guía en español por criterio y una escala de 1 a 9.
- La banda estimada es el promedio de los cuatro criterios redondeado al 0.5 más cercano. Se guarda junto con el texto, la fecha, el tiempo y las palabras.
- La interfaz repite que es una autoestimación orientativa. No se usa IA ni se presenta como calificación oficial.
- La tab de Writing muestra los temas y un indicador de borrador; al guardar un ensayo se navega a Progreso.

## Fase 4: Progreso, Ajustes y recordatorios

- Progreso deriva todas sus métricas del estado global: racha actual y máxima, palabras guardadas, quizzes, ensayos, actividad de los últimos siete días y evolución de la banda estimada de los últimos seis ensayos.
- La actividad semanal cuenta tareas completadas por día (0 a 3). Los gráficos se construyen con `View` y estilos; no se añadió una librería de gráficos.
- Ajustes permite editar banda y fecha con la misma validación del onboarding. Los cambios se reflejan de inmediato en Inicio.
- El recordatorio local se implementó con `expo-notifications`, pero en Expo Go SDK 57 la carga del módulo impedía abrir la app: el layout raíz quedaba sin export default y Expo Router fallaba con `Cannot read property 'ErrorBoundary' of undefined`.
- Para mantener el MVP funcional se retiró `expo-notifications` del arranque, de Ajustes, de `app.json` y de `package.json`. Ajustes muestra una nota de función pendiente; no hay interruptor ni simulación.
- Los campos `reminderEnabled` y `reminderTime` se conservan en el perfil y en la validación de almacenamiento para una integración futura, pero no se editan en esta versión.
- El borrado de datos usa un modal de confirmación. Cancelar conserva todo; confirmar elimina las claves v2 y v1, restablece el estado y vuelve a Onboarding. Los recordatorios quedan pendientes.

## Fase 5: pulido y revisión

- Se revisaron estados vacíos: sin palabras guardadas, sin borradores, sin ensayos, sin quizzes y quiz con menos de cuatro palabras disponibles.
- Se mejoraron áreas táctiles y etiquetas de accesibilidad: acciones de texto convertidas en `Pressable`, objetivos de al menos 44 px y botones de puntuación con ancho suficiente.
- Se evitó que la última tarjeta de métricas de Progreso se estire a todo el ancho y se añadió `try/finally` al borrado para no dejar el modal bloqueado si falla el almacenamiento.
- No se añadieron funciones fuera del alcance ni datos simulados para llenar gráficos o métricas.
- La documentación final se actualizó con comandos, rutas, límites y recorridos de prueba.
- Se retiró el módulo de notificaciones del arranque y de Ajustes; la app vuelve a abrir sin él y los recordatorios quedan como trabajo futuro.

## Modelo de datos

- Los modelos se alinearon con el alcance: `Profile`, `Word`, `QuizResult`, `Essay`, `DailyActivity` y `AppState`.
- Se subió el esquema a `schemaVersion: 2` y se cambió la clave de almacenamiento a `@ielts-daily/app-state-v2`. No hay migración desde la versión 1 porque no existían datos reales de usuario.
- `Profile.targetBand` acepta valores de 5.0 a 9.0 en incrementos de 0.5. `examDate` es opcional.
- `Word` conserva el contenido semilla (`category`, `partOfSpeech`, `definitionEn`, `meaningEs`, `exampleEn`) y el progreso local (`isSaved`, `status`, `reviewCount`, `lastReviewedAt`).
- `QuizResult` registra fecha local, respuestas y aciertos. `Essay` guarda borrador, texto, palabras, tiempo, criterios y banda estimada. `DailyActivity` usa una fecha local `YYYY-MM-DD` y tres tareas.
- Las fechas de calendario se construyen con la zona horaria local del dispositivo para evitar desfases por UTC. Los timestamps se guardan en ISO 8601.
- La racha cuenta días consecutivos con al menos una tarea completada. Si hoy aún no hay actividad, la racha se mantiene desde ayer; si tampoco hubo actividad ayer, es 0.
- La palabra del día se calcula de forma determinista a partir de la fecha local (`YYYYMMDD % cantidad de palabras`).
- Guardar la palabra del día completa la tarea `wordOfDay` de ese día. Desmarcarla no borra el historial de actividad.

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
- Se retiró `expo-notifications` y su plugin para evitar el fallo de arranque en Expo Go. No se añadieron librerías de gráficos, estado, formularios ni estilos.
- Se retiraron `@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-image`, `expo-symbols`, `expo-system-ui` y `expo-web-browser` del manifiesto directo.

## Entrada de fechas

- No se añadió un selector de fecha nativo para evitar otra dependencia. La fecha se escribe con máscara `DD/MM/AAAA` y se valida como fecha real y futura.
- Si el usuario deja la fecha vacía, Inicio muestra un estado sin cuenta regresiva y un acceso a Ajustes. La cuenta regresiva nunca muestra valores negativos.

## Estado final del MVP

- Implementado: base, tema, modelos, reducer, persistencia versionada, onboarding, Inicio, Vocabulario, quiz, Writing con temporizador y borrador, autoevaluación, Progreso, Ajustes y borrado seguro.
- Fuera de alcance por decisión: login, backend, pagos, IA, voz, Listening, Reading, Speaking y funciones sociales.
- Diferido: recordatorio local. Se retiró para que la app abra en Expo Go; queda documentado como trabajo futuro.
- Pendiente de prueba interactiva en dispositivo físico o navegador real. La verificación actual es estática, de compilación, de exportación web y de lógica pura.

## Verificación final

- `npx tsc --noEmit`: sin errores.
- `npm run lint`: sin errores.
- `npx expo-doctor`: 21/21 comprobaciones correctas.
- `npx expo export --platform web`: exportación estática correcta con 14 rutas.
- `npx expo export --platform android`: bundle de Android correcto, sin `expo-notifications`.
- Se comprobaron con `tsx` las bandas, fechas, rachas, palabra del día, quiz y las transiciones principales del reducer.
- No se probó en dispositivo físico ni emulador. No se afirma que los recorridos se hayan ejecutado en un dispositivo; quedan documentados en `docs/PRUEBAS.md` para la prueba final.
