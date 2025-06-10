# Sistema de Gestión de Inventario - Vitis Store SAS

![Logo UAN](https://www.uan.edu.co/images/logo-footer.png)

## 📋 Descripción

Sistema web para la gestión y control de inventario de la empresa Comercializadora Vitis Store SAS. Esta aplicación permite automatizar los procesos de administración de productos, registro de entradas y salidas, generación de reportes y configuración de alertas para optimizar la gestión del inventario.

## 🚀 Características principales

- Gestión completa del catálogo de productos
- Registro detallado de movimientos de inventario (entradas/salidas)
- Dashboard analítico con KPIs e indicadores clave
- Sistema de alertas para niveles críticos de stock
- Generación de reportes personalizables
- Interfaz responsive accesible desde cualquier dispositivo

## 🛠️ Tecnologías utilizadas

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS para estilos
- React Query para manejo de estado
- Desplegado en Vercel

### Backend
- Node.js
- API RESTful
- TypeScript
- Express.js
- Desplegado en Render

### Base de datos
- PostgreSQL (gestionado por Supabase)
- Supabase Auth para autenticación

## 📦 Estructura del proyecto

```
vitis-store/
├── frontend/                # Aplicación Next.js
│   ├── public/              # Archivos estáticos
│   ├── src/                 # Código fuente
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Contextos de React
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Páginas y rutas
│   │   ├── services/        # Servicios y APIs
│   │   ├── styles/          # Estilos globales
│   │   └── utils/           # Utilidades
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                 # API REST en Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Middleware
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Rutas de la API
│   │   ├── services/        # Servicios
│   │   └── utils/           # Utilidades
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                    # Documentación
    ├── manual-tecnico.pdf
    └── manual-usuario.pdf
```

## ⚙️ Requisitos

- Node.js v16.x o superior
- npm o yarn
- PostgreSQL (o cuenta en Supabase)
- Acceso a internet para utilizar servicios cloud

## 🔧 Instalación y configuración

### Clonar el repositorio

```bash
git clone https://github.com/GiselCaicedo/vitis-store.git
cd vitis-store
```

### Configurar el backend

```bash
cd backend
npm install

# Crear archivo .env con las variables de entorno
cp .env.example .env
# Editar el archivo .env con tus credenciales de Supabase
```

### Configurar el frontend

```bash
cd ../frontend
npm install

# Crear archivo .env.local con las variables de entorno
cp .env.example .env.local
# Editar el archivo .env.local con las URLs y credenciales correspondientes
```

### Iniciar el desarrollo

```bash
# Terminal 1: Iniciar el backend
cd backend
npm run dev

# Terminal 2: Iniciar el frontend
cd frontend
npm run dev
```

## 🌐 Despliegue

### Backend (Render)

1. Crear un nuevo servicio Web en Render
2. Conectar con el repositorio de GitHub
3. Seleccionar la carpeta `/backend`
4. Configurar las variables de entorno necesarias
5. Configurar el comando de inicio: `npm start`

### Frontend (Vercel)

1. Importar el proyecto desde GitHub en Vercel
2. Seleccionar la carpeta `/frontend`
3. Configurar las variables de entorno
4. Desplegar

## 📚 Documentación

- [Manual Técnico](./docs/manual-tecnico.pdf)
- [Manual de Usuario](./docs/manual-usuario.pdf)

## 🧪 Pruebas

```bash
# Ejecutar pruebas en el backend
cd backend
npm test

# Ejecutar pruebas en el frontend
cd frontend
npm test
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 👥 Autores

- **Christian Camilo Depablo Gonzalez** - [GitHub](https://github.com/ChristianDepablo)
- **Gisel Daniela Caicedo Soler** - [GitHub](https://github.com/GiselCaicedo)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Universidad Antonio Nariño
- Programa Ingeniería de Sistemas y Computación
- Facultad de Ingeniería de Sistemas
