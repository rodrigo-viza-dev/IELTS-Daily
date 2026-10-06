# IELTS Daily

Aplicación móvil offline-first para practicar IELTS en sesiones cortas. Está construida con Expo, React Native, TypeScript y Expo Router.

## Desarrollo

```bash
npm install
npx expo start
```

Para abrir la versión web, presiona `w` en la terminal de Expo. Para Android o iOS, usa Expo Go o un development build compatible con Expo SDK 57.

## Comandos de verificación

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
npx expo export --platform web
```

## Estructura

- `src/app/`: rutas Expo Router; las tabs están en `src/app/(tabs)/`.
- `src/components/`: componentes visuales reutilizables.
- `src/context/` y `src/storage/`: estado local y persistencia con AsyncStorage.
- `src/data/seed/`: contenido semilla en JSON.
- `src/types/`: modelos de dominio.
- `docs/DECISIONES.md`: decisiones y supuestos del proyecto.

La implementación se desarrolla por fases. El alcance de cada fase está definido en `AGENTS.md`.
