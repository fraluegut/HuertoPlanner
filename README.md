# 🌱 HuertoPlanner

**HuertoPlanner** es una aplicación web interactiva diseñada para ayudar a los usuarios a planificar y gestionar sus huertos urbanos. Utilizando herramientas visuales intuitivas y fáciles de usar, los usuarios pueden diseñar sus bancales, gestionar las especies de plantas, y optimizar su producción en función de varios parámetros personalizados.

## 🖥️ Tecnologías Utilizadas

El proyecto está construido con las siguientes tecnologías:

- **Frontend**: React con Material-UI para los componentes de interfaz de usuario.
- **Backend**: Flask como servidor web y API RESTful.
- **Base de Datos**: MySQL para almacenar datos persistentes.
- **Autenticación**: Integración inicial con autenticación básica (usuario "admin" y contraseña "admin").
- **API**: Interacciones definidas con endpoints claros para la gestión de datos.

## 📋 Funcionalidades

### 🌿 Planificador de Bancales

- Diseña y organiza tu huerto urbano utilizando un tablero visual donde puedes arrastrar y soltar diferentes especies de plantas.
- Añade, edita o elimina bancales según tus necesidades.
- Visualiza las fases de crecimiento de cada planta con indicadores visuales.

### 🌻 Gestión de Plantas

- Añade diferentes especies de plantas a tu inventario personal.
- Configura la producción sugerida y personalizada por planta para cada celda.
- Visualiza las plantas recomendadas y personalizadas en cada bancal.

### 📊 Dashboard

- Obtén una visión general del rendimiento de tu huerto.
- Monitorea la producción y realiza ajustes en tiempo real.
- Verifica el estado de cada planta y bancal con estadísticas y gráficos fáciles de entender.

### 🔐 Autenticación

- Inicio de sesión simple con usuario y contraseña para asegurar la privacidad de los datos.
- Integración planeada para futuros inicios de sesión con Google u otros proveedores de identidad.

## 🚀 Cómo Empezar

Sigue estos pasos para poner en marcha el proyecto en tu máquina local:

### 1. Clona el Repositorio

\`\`\`bash
git clone https://github.com/fraluegut/HuertoPlanner.git
cd HuertoPlanner
\`\`\`

### 2. Configura el Backend

1. **Instala las dependencias de Python**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. **Configura la Base de Datos**:
   - Asegúrate de tener MySQL instalado y ejecutándose.
   - Crea la base de datos:
     \`\`\`sql
     CREATE DATABASE huerto_planner;
     \`\`\`
   - Importa las tablas y datos iniciales desde el archivo SQL proporcionado.

3. **Ejecuta el Servidor Backend**:
   \`\`\`bash
   python app.py
   \`\`\`

### 3. Configura el Frontend

1. **Instala las dependencias de Node.js**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Ejecuta la aplicación React**:
   \`\`\`bash
   npm start
   \`\`\`

3. **Accede a la Aplicación**:
   - Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

## 📂 Estructura del Proyecto
```
HuertoPlanner/
├── backend/                # Código del servidor backend en Flask
│   ├── app.py              # Archivo principal del servidor
│   ├── models.py           # Definición de modelos de datos
│   ├── routes.py           # Endpoints de la API RESTful
│   └── ...                 # Otros archivos relacionados con el backend
├── frontend/               # Código de la aplicación React
│   ├── src/
│   │   ├── components/     # Componentes de React
│   │   ├── pages/          # Páginas de la aplicación
│   │   └── App.js          # Componente principal
│   └── ...                 # Otros archivos relacionados con el frontend
├── README.md               # Este archivo de documentación
└── ...                     # Otros archivos y directorios
```

## ⚙️ Endpoints de la API

La aplicación utiliza varios endpoints para manejar las interacciones entre el frontend y el backend. Algunos de los principales endpoints incluyen:

- `GET /bancales` - Obtener todos los bancales.
- `POST /bancales` - Crear un nuevo bancal.
- `PUT /bancales/:id` - Actualizar un bancal existente.
- `DELETE /bancales/:id` - Eliminar un bancal.

Para ver la lista completa de endpoints, consulta el archivo `routes.py` en el directorio `backend`.

## 🛠️ Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar:

1. Haz un fork del proyecto.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Envía tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## 📞 Soporte

Si necesitas ayuda, no dudes en abrir un **issue** en el repositorio.

## 📄 Licencia

Por ahora, este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

¡Gracias por utilizar **HuertoPlanner**! 🌻🛠️