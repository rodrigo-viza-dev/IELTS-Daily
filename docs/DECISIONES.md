# Decisiones del proyecto

## Fase 1: Base

- La app funciona como un producto local y offline-first para un único usuario.
- No se implementan login, backend, sincronización, pagos ni funciones sociales.
- Expo Router organiza las pantallas dentro de `src/app/`. El grupo `src/app/(tabs)/` contiene las cuatro tabs principales: Inicio, Vocabulario, Writing y Progreso. Ajustes queda fuera de las tabs.
- Se usa el componente `Tabs` de Expo Router en lugar de `NativeTabs`, porque la navegación JavaScript mantiene el mismo comportamiento en Android, iOS y web y evita depender de una API experimental.
- La interfaz se prepara en español; las palabras, ejemplos y consignas de práctica están en inglés.
- Se mantiene una paleta propia de IELTS Daily con variantes clara y oscura, sin añadir una dependencia de tipografías o un sistema visual pesado.

## Estado y almacenamiento

- El estado de la aplicación se gestiona con React Context mediante `AppProvider`.
- AsyncStorage guarda un único documento JSON bajo la clave `@ielts-daily/app-state-v1`.
- El documento persistido tiene `schemaVersion: 1` para permitir migraciones explícitas en el futuro.
- AsyncStorage no cifra los datos. Los ensayos se consideran datos locales del usuario y no se envían a un servidor.
- Si el documento no existe, está corrupto o no coincide con el esquema conocido, se crea un estado inicial con las palabras semilla en estado `new`.
- Las consignas de Writing y las preguntas guía son contenido estático del paquete y no se duplican en el estado persistido.
- El borrado de datos elimina únicamente el documento de AsyncStorage; las semillas permanecen en la aplicación.

## Modelo de datos

- `UserProfile` representa la banda objetivo, la fecha opcional del examen y el recordatorio local.
- Las bandas objetivo aceptan valores de 5.0 a 9.0 en incrementos de 0.5.
- `Word` conserva el contenido semilla y su progreso (`new`, `review` o `mastered`). En esta fase no se implementa repetición espaciada.
- `QuizResult` registra cinco preguntas y sus respuestas, aunque el quiz se implementará en una fase posterior.
- `WritingEntry` reserva el texto, el conteo de palabras, el tiempo, los cuatro criterios y la banda global.
- Los scores de autoevaluación serán enteros de 1 a 9. La autoevaluación será orientativa y no reemplazará una calificación oficial.
- `DailyLog` usa una fecha local `YYYY-MM-DD` y un timestamp ISO 8601 para registrar las actividades del día.
- Las fechas de calendario usan la zona horaria local del dispositivo; los timestamps se guardan en formato ISO 8601.

## Contenido semilla

- `words.json` contiene 40 palabras académicas con definición en español y ejemplo en inglés.
- `writing-prompts.json` contiene 12 consignas originales de Writing Task 2. No se copiaron preguntas oficiales.
- `writing-guide-questions.json` contiene una pregunta guía para cada criterio de autoevaluación.
- Los IDs de las semillas son estables y no deben cambiarse sin una migración de datos.

## Alcance de esta fase

- Las pantallas muestran la estructura y el contenido preparado, pero no implementan onboarding, edición de perfil, repaso, quiz, editor de Writing, temporizador, gráficos ni notificaciones.
- La implementación de esas funciones queda para las fases siguientes según `AGENTS.md`.
- Los assets visuales del scaffold de Expo se conservan temporalmente porque `app.json` todavía los referencia. Se reemplazarán cuando se trabaje la identidad visual final.
