# Pruebas y recorridos

## Entorno de verificación

- Fecha de revisión: 1 de noviembre de 2026.
- WSL (Kali Linux), sin emulador ni dispositivo conectado.
- Verificación estática, de compilación, de exportación web/Android y de lógica pura con `tsx`.
- No se ejecutó la interfaz en un dispositivo físico ni en un navegador real. Los recorridos de pantalla quedan pendientes de la prueba final del usuario.

## Comprobaciones automáticas

| Comprobación | Resultado |
| --- | --- |
| `npx tsc --noEmit` | Sin errores. |
| `npm run lint` | Sin errores. |
| `npx expo-doctor` | 21/21 comprobaciones correctas. |
| `npx expo export --platform web` | Exportación correcta con 14 rutas. |
| `npx expo export --platform android` | Bundle correcto, sin `expo-notifications`. |
| Lógica de bandas, fechas, rachas, palabra del día y quiz | Comprobada con `tsx`; todos los casos pasaron. |
| Reducer: guardar dos veces, quiz, borrador, ensayo y reset | Comprobado con `tsx`; todos los casos pasaron. |

Casos de lógica comprobados:

- Promedio de 6, 7, 7 y 8 = 7.0; redondeo al 0.5.
- Fecha inválida `29/02/2025` rechazada; `29/02/2024` aceptada.
- Cuenta regresiva de 9 días entre el 1 y el 10 de noviembre de 2026.
- Racha de 3 días conservada si hoy aún no hay actividad; racha 0 si el último día activo fue anterior a ayer.
- Palabra del día determinista para la misma fecha.
- Quiz de 5 palabras únicas, 4 opciones por pregunta y la respuesta correcta incluida.
- Guardar dos veces una palabra no crea duplicados.
- Un quiz persiste el resultado y marca la actividad diaria.
- Un borrador no marca Writing como completado; el ensayo terminado sí.
- Reset vuelve al estado inicial.

## Recorridos manuales

| # | Recorrido | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- | --- |
| 1 | Primera apertura | Abrir la app sin datos. Elegir banda, dejar la fecha vacía o escribir una futura y pulsar Empezar. | Se muestra Onboarding; al continuar se guarda el perfil y se abre Inicio. | Revisado en código/build; pendiente de ejecución interactiva. |
| 2 | Guardar palabra dos veces | En Vocabulario, pulsar Guardar palabra y luego Quitar; volver a guardar. | La lista no duplica la palabra; el contador coincide con las palabras guardadas. | Lógica del reducer comprobada; pendiente de UI. |
| 3 | Completar quiz | Abrir Quiz, responder las 5 preguntas y ver el resultado. Ir a Progreso. | Se guarda el resultado, se incrementa el total de quizzes y la actividad del día queda marcada. | Lógica del reducer comprobada; pendiente de UI. |
| 4 | Ensayo corto | Abrir un tema, escribir menos de 250 palabras y pulsar Terminar y autoevaluar. | Aparece la advertencia de mínimo, sin bloquear la autoevaluación. | Revisado en código/build; pendiente de UI. |
| 5 | Promedio 7.0 | En Autoevaluación elegir 6, 7, 7 y 8. | La banda estimada muestra 7.0. | Lógica comprobada; pendiente de UI. |
| 6 | Persistencia | Guardar una palabra, escribir un borrador, cerrar y reabrir la app. | Perfil, palabra y borrador siguen disponibles. | Persistencia revisada en código; pendiente de ejecución real. |
| 7 | Cambiar fecha | En Ajustes cambiar la fecha del examen y guardar. Volver a Inicio. | La cuenta regresiva se actualiza y nunca muestra días negativos. | Revisado en código/build; pendiente de UI. |
| 8 | Borrar datos | En Ajustes abrir Borrar todos mis datos. Cancelar; repetir y confirmar. | Cancelar conserva todo. Confirmar borra el estado y vuelve a Onboarding. | Revisado en código/build; pendiente de UI. |
| 9 | Móvil y web | Recorrer las pantallas en una ventana angosta y en web. | Sin desbordamientos, textos cortados, controles inaccesibles ni botones muertos. | Export web correcto; pendiente de revisión visual real. |

## Limitaciones de la verificación

- Los recordatorios locales se retiraron temporalmente: `expo-notifications` impedía abrir la app en Expo Go SDK 57. Quedan como trabajo futuro y no forman parte de esta prueba.
- No se probó la cámara ni hardware; la app no los usa.
- La exportación estática web no equivale a una prueba de navegación interactiva.
- La prueba final debe hacerse en Windows con `npx expo start` y, si se desea, en Expo Go o un development build.

## Capturas pendientes

Onboarding, Inicio con fecha, Vocabulqario, Quiz, Editor de Writing, Autoevaluación, Progreso y Ajustes.
