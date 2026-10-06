This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

cat >> AGENTS.md << 'EOF'

---

# IELTS Daily — Contexto del proyecto

## Qué es
App móvil (React Native + Expo + TypeScript) para un trabajo grupal de Ingeniería de Sistemas, UNSA (Arequipa, Perú). La consigna pide una app móvil que resuelva un problema cotidiano. No tiene que ser compleja: tiene que ser simple, completa, funcional y bien justificada.

## Problema que resuelve
Estudiantes universitarios peruanos que se preparan solos para IELTS tienen poco tiempo, estudian de forma irregular, olvidan el vocabulario por no repasarlo, practican Writing sin tiempo límite ni criterios de evaluación y no ven su progreso. Las apps existentes son pesadas, de pago o abarcan demasiado. IELTS Daily ofrece una rutina diaria corta, ligera, gratuita y que funciona sin internet.

## Por qué esta idea
Problema real y cercano al equipo, alcance acotado, fácil de entender y validar, y permite aplicar el ciclo completo: diseño (Stitch/Figma), implementación (React Native), pruebas y documentación.

## Público
Universitarios de 18 a 28 años, nivel B1–B2, con 15–30 minutos diarios en el celular.

## Alcance MVP
1. Onboarding: banda objetivo (5.0–9.0) y fecha de examen opcional.
2. Inicio: cuenta regresiva, racha diaria y tareas del día con check.
3. Vocabulario: palabra del día, lista guardada, estado (new / review / mastered).
4. Quiz: 5 preguntas de opción múltiple generadas desde las palabras guardadas.
5. Writing Task 2: temas, editor con temporizador de 40 min y conteo de palabras (mínimo 250).
6. Autoevaluación: 4 criterios (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy) de 1 a 9, con una pregunta guía por criterio. Promedio redondeado a 0.5.
7. Progreso: racha actual y máxima, palabras aprendidas, ensayos hechos, gráfico semanal y evolución del promedio.
8. Ajustes: editar banda y fecha, recordatorio diario local, borrar datos.

## Fuera de alcance (no implementar)
Login, backend, pagos, IA que califique ensayos, voz, Listening, Reading, Speaking y funciones sociales. Solo se mencionan como trabajo futuro en el informe.

## Decisiones del proyecto
- Navegación con Expo Router, en `src/app/`. Tabs: Inicio, Vocabulario, Writing, Progreso. Ajustes como pantalla aparte. Elimina el contenido de ejemplo de la plantilla.
- Persistencia local con AsyncStorage. Estado con Context o Zustand.
- Notificaciones locales con expo-notifications. Si no funcionan en Expo Go, avísame y se deja para el final.
- Gráficos simples con View o react-native-svg, sin librerías pesadas.
- Contenido semilla en JSON dentro del repo: 40 palabras académicas, 12 temas originales de Writing Task 2 (no copiar preguntas oficiales) y 4 preguntas guía.
- Interfaz en español, contenido de práctica en inglés. Offline-first.
- Modelo de datos: UserProfile, Word, QuizResult, WritingPrompt, WritingEntry (con scores y overallBand), DailyLog. Se puede ajustar documentando el cambio.

## Entorno de trabajo
- Trabajas en WSL (Kali Linux). No puedes abrir emulador ni dispositivo.
- Verifica con `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` y, si es posible, `npx expo export --platform web`.
- No dejes `expo start` corriendo. Yo hago las pruebas finales en Windows (navegador o Expo Go) y te devuelvo los errores.
- No toques archivos fuera de esta carpeta.

## Forma de trabajo: incremental
Una fase a la vez; detente al terminar cada una:
1. Base: carpetas, tema, navegación, almacenamiento y datos semilla.
2. Onboarding y Home.
3. Vocabulario.
4. Quiz.
5. Writing y autoevaluación.
6. Progreso y Ajustes (con notificaciones).
7. Pulido, estados vacíos y revisión de errores.

Al cerrar cada fase:
- Haz un commit de git con mensaje claro.
- Resume en máximo 5 líneas qué hiciste y qué archivos tocaste.
- Dime qué probar y cómo (pantalla, pasos, resultado esperado).
- Anota decisiones y supuestos en `docs/DECISIONES.md`; servirán para el informe final.

## Reglas
- Código simple, tipado, sin sobreingeniería.
- No inventes estadísticas, encuestas ni citas. Si falta un dato, escribe "[por completar]".
- La autoevaluación es orientativa y no reemplaza una calificación oficial.
- Si un requisito se vuelve costoso, simplifícalo y regístralo en `docs/DECISIONES.md`.
- Al final se redactará un informe académico (introducción, problema, justificación, objetivos, alcance, requisitos, diseño, arquitectura, modelo de datos, implementación, pruebas, conclusiones, trabajo futuro, referencias reales). Mantén `docs/DECISIONES.md` actualizado.
- Responde en español.
EOF