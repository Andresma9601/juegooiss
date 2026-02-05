# 📝 Manual Paso a Paso: Cómo Agregar Preguntas de Trivia

**¡Bienvenido!** Este manual te guiará paso a paso para agregar nuevas preguntas al juego de trivia. No necesitas ser experto en programación, solo seguir las instrucciones cuidadosamente.

---

## 🎯 ¿Qué vamos a hacer?

Vamos a agregar nuevas preguntas al archivo que contiene todas las preguntas del juego. Es como agregar una nueva página a un libro, pero siguiendo reglas específicas.

---

## 📂 PASO 1: Encontrar el Archivo Correcto

**El archivo donde están las preguntas se llama:**
```
preguntas_trivia.json
```

**¿Dónde está ubicado?**
- Dentro de la carpeta llamada `data`
- La ruta completa es: `data/preguntas_trivia.json`

**¡IMPORTANTE!** 🚨 
- Este archivo NO se puede cambiar de nombre
- Debe mantenerse exactamente como `preguntas_trivia.json`
- Debe estar siempre en la carpeta `data`

---

## 📝 PASO 2: Entender el Formato de una Pregunta

Cada pregunta es como llenar un formulario con 9 campos obligatorios. Aquí tienes la plantilla:

```json
{
  "pregunta": "Escribe aquí tu pregunta",
  "opciones": [
    "Primera opción de respuesta",
    "Segunda opción de respuesta", 
    "Tercera opción de respuesta",
    "Cuarta opción de respuesta"
  ],
  "respuestaCorrecta": "Copia aquí la opción correcta EXACTAMENTE igual",
  "mensajeCorrecto": "Mensaje que aparece cuando aciertan",
  "mensajeIncorrecto": "Mensaje que aparece cuando fallan",
  "efectoDinero": 30,
  "efectoSalud": 0,
  "efectoOcio": 0,
  "efectoConocimiento": 10,
  "categoria": "Conocimiento"
}
```

---

## � PASO 3: Explicación Detallada de Cada Campo

### 1. "pregunta" 
**¿Qué es?** El texto de tu pregunta
**Ejemplo:** `"¿Qué es la Seguridad Social?"`
**Reglas:**
- Debe estar entre comillas dobles `" "`
- Puede incluir signos de interrogación
- Mantén la pregunta clara y simple

### 2. "opciones"
**¿Qué es?** Las 4 posibles respuestas
**Reglas IMPORTANTES:**
- Siempre deben ser exactamente 4 opciones
- Cada opción va entre comillas dobles
- Se separan con comas
- Una debe ser la respuesta correcta
- Las otras 3 son respuestas incorrectas (distractores)

**Ejemplo:**
```json
"opciones": [
  "Un sistema de protección social",
  "Un tipo de seguro privado",
  "Una empresa del gobierno",
  "Un banco estatal"
]
```

### 3. "respuestaCorrecta"
**¡MUY IMPORTANTE!** 🚨
- Debe ser EXACTAMENTE igual a una de las 4 opciones
- Mismas mayúsculas, minúsculas, espacios y puntuación
- Si la opción dice `"Un sistema de protección social"`, la respuesta correcta debe ser idéntica

### 4. "mensajeCorrecto"
**¿Qué es?** El mensaje que ve el jugador cuando acierta
**Ejemplo:** `"¡Excelente! La Seguridad Social protege a todos los ciudadanos"`

### 5. "mensajeIncorrecto"
**¿Qué es?** El mensaje que ve el jugador cuando falla
**Ejemplo:** `"Incorrecto. La Seguridad Social es un derecho fundamental"`

### 6. Efectos (números sin comillas)
Estos números afectan las estadísticas del jugador:
- **"efectoDinero"**: Dinero que gana (puede ser de 0 a 50)
- **"efectoSalud"**: Puntos de salud (normalmente 0)
- **"efectoOcio"**: Puntos de ocio (normalmente 0)  
- **"efectoConocimiento"**: Puntos de conocimiento (puede ser de 5 a 20)

### 7. "categoria"
**¿Qué es?** El tema de la pregunta
**Opciones sugeridas:**
- `"Conocimiento"`
- `"Pensiones"`
- `"Salud"`
- `"Requisitos"`
- `"Derechos"`

---

## 🛠️ PASO 4: Abrir el Archivo para Editarlo

**Opción 1: En Windows**
1. Ve a la carpeta del juego
2. Entra a la carpeta `data`
3. Haz clic derecho en `preguntas_trivia.json`
4. Selecciona "Abrir con" → "Bloc de notas" o "Notepad++"

**Opción 2: En Mac**
1. Ve a la carpeta del juego
2. Entra a la carpeta `data`
3. Haz clic derecho en `preguntas_trivia.json`
4. Selecciona "Abrir con" → "TextEdit"

**Opción 3: Editor de código (recomendado)**
- Visual Studio Code
- Sublime Text
- Atom

---

## ✏️ PASO 5: Cómo Agregar Tu Nueva Pregunta

**¡ATENCIÓN!** Antes de empezar, haz una copia de seguridad del archivo original.

### 5.1 Entender la estructura del archivo
Cuando abras el archivo verás algo así:
```json
[
  {
    "pregunta": "Primera pregunta...",
    ...
  },
  {
    "pregunta": "Segunda pregunta...",
    ...
  }
]
```

### 5.2 Encontrar dónde agregar tu pregunta
1. Ve hasta el final del archivo
2. Busca el último `}` antes del `]` final
3. Después de ese `}`, agrega una coma `,`

### 5.3 Agregar tu pregunta
Después de la coma, pega tu nueva pregunta siguiendo el formato.

**Ejemplo de cómo debe quedar:**
```json
[
  {
    "pregunta": "Pregunta existente...",
    "opciones": ["A", "B", "C", "D"],
    ...
  },
  {
    "pregunta": "¿Cuál es la edad de jubilación en España?",
    "opciones": [
      "65 años",
      "60 años", 
      "67 años",
      "70 años"
    ],
    "respuestaCorrecta": "67 años",
    "mensajeCorrecto": "¡Correcto! En España la edad de jubilación es 67 años",
    "mensajeIncorrecto": "No es correcto. La edad de jubilación en España es 67 años",
    "efectoDinero": 25,
    "efectoSalud": 0,
    "efectoOcio": 0,
    "efectoConocimiento": 15,
    "categoria": "Pensiones"
  }
]
```

---

## ✅ PASO 6: Verificar que Todo Esté Correcto

### 6.1 Lista de verificación:
- [ ] ¿Agregaste la coma después de la pregunta anterior?
- [ ] ¿Tu pregunta tiene exactamente 4 opciones?
- [ ] ¿La respuesta correcta es EXACTAMENTE igual a una de las opciones?
- [ ] ¿Todos los textos están entre comillas dobles?
- [ ] ¿Los números (efectos) NO tienen comillas?
- [ ] ¿El archivo termina con `]`?

### 6.2 Verificar sintaxis online:
1. Copia todo el contenido del archivo
2. Ve a: https://jsonlint.com/
3. Pega el contenido
4. Haz clic en "Validate JSON"
5. Si hay errores, te dirá exactamente dónde están

---

## � PASO 7: Guardar el Archivo

1. Presiona `Ctrl + S` (Windows) o `Cmd + S` (Mac)
2. **¡IMPORTANTE!** Asegúrate de que se guarde como `preguntas_trivia.json`
3. NO cambies el nombre del archivo
4. NO cambies la extensión `.json`

---

## 🚀 PASO 8: Subir al Servidor

**¡MUY IMPORTANTE!** 🚨

Una vez que hayas terminado de agregar preguntas:

1. **El archivo debe mantenerse con el mismo nombre:** `preguntas_trivia.json`
2. **Debe estar en la misma carpeta:** `data/`
3. **Al subir al servidor, mantén la estructura:**
   ```
   tu-juego/
   ├── data/
   │   └── preguntas_trivia.json  ← Este archivo
   ├── games/
   ├── css/
   └── js/
   ```

**¿Por qué es importante?**
- El juego busca el archivo en esa ubicación exacta
- Si cambias el nombre o la ubicación, el juego no funcionará
- El servidor debe tener la misma estructura de carpetas

---

## 🔧 PASO 9: Probar que Funciona

1. Abre el juego en tu navegador
2. Ve a la sección de Trivia
3. Juega algunas rondas para verificar que tus preguntas aparecen
4. Verifica que los mensajes se muestren correctamente
5. Confirma que la respuesta correcta funciona

---

## ❌ Errores Más Comunes (y cómo evitarlos)

### Error 1: Falta una coma
**Problema:** Entre preguntas debe haber una coma
```json
// ❌ MAL
{
  "pregunta": "Pregunta 1"
}
{
  "pregunta": "Pregunta 2"
}

// ✅ BIEN  
{
  "pregunta": "Pregunta 1"
},
{
  "pregunta": "Pregunta 2"
}
```

### Error 2: Respuesta correcta no coincide
**Problema:** La respuesta correcta debe ser EXACTAMENTE igual a una opción
```json
// ❌ MAL
"opciones": ["Opción A", "Opción B"],
"respuestaCorrecta": "opcion a"  // Diferentes mayúsculas

// ✅ BIEN
"opciones": ["Opción A", "Opción B"],
"respuestaCorrecta": "Opción A"  // Exactamente igual
```

### Error 3: Número incorrecto de opciones
```json
// ❌ MAL - Solo 3 opciones
"opciones": ["A", "B", "C"]

// ✅ BIEN - 4 opciones
"opciones": ["A", "B", "C", "D"]
```

### Error 4: Comillas incorrectas
```json
// ❌ MAL - Comillas curvas
"pregunta": "¿Qué es esto?"

// ✅ BIEN - Comillas rectas
"pregunta": "¿Qué es esto?"
```

---

## � Plantilla para Copiar y Pegar

Usa esta plantilla para crear nuevas preguntas:

```json
,
{
  "pregunta": "ESCRIBE AQUÍ TU PREGUNTA",
  "opciones": [
    "PRIMERA OPCIÓN",
    "SEGUNDA OPCIÓN",
    "TERCERA OPCIÓN",
    "CUARTA OPCIÓN"
  ],
  "respuestaCorrecta": "COPIA AQUÍ LA OPCIÓN CORRECTA EXACTAMENTE IGUAL",
  "mensajeCorrecto": "MENSAJE CUANDO ACIERTAN",
  "mensajeIncorrecto": "MENSAJE CUANDO FALLAN",
  "efectoDinero": 25,
  "efectoSalud": 0,
  "efectoOcio": 0,
  "efectoConocimiento": 10,
  "categoria": "Conocimiento"
}
```

**Instrucciones:**
1. Copia esta plantilla
2. Reemplaza el texto en MAYÚSCULAS con tu contenido
3. Pégala al final del archivo (antes del `]` final)
4. No olvides la coma al principio

---

## 🆘 ¿Necesitas Ayuda?

**Si algo no funciona:**
1. Verifica la lista de errores comunes
2. Usa https://jsonlint.com/ para verificar el formato
3. Haz una copia de seguridad antes de hacer cambios
4. Si el juego no carga, revisa que el archivo esté en `data/preguntas_trivia.json`

**Recuerda:**
- El archivo SIEMPRE debe llamarse `preguntas_trivia.json`
- SIEMPRE debe estar en la carpeta `data`
- Al subir al servidor, mantén la misma estructura de carpetas

---

## 🎉 ¡Felicidades!

Si has seguido todos los pasos, ya sabes cómo agregar preguntas al juego. ¡Gracias por contribuir al contenido educativo!

**Resumen final:**
1. ✅ Archivo: `data/preguntas_trivia.json`
2. ✅ Formato: Seguir la plantilla exactamente
3. ✅ Verificar: Usar herramientas online
4. ✅ Guardar: Mismo nombre y ubicación
5. ✅ Servidor: Mantener estructura de carpetas
