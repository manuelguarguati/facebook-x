# Manuel Asistente IA - Resumen del Proyecto

**Manuel Asistente IA** es una plataforma SaaS diseñada para automatizar y mejorar la presencia en redes sociales (especialmente Facebook) utilizando Inteligencia Artificial.

## 🎯 Objetivo del Proyecto
Proporcionar a los creadores de contenido y dueños de negocios una herramienta "todo en uno" que permita:
1.  **Generar contenido viral** con IA de forma instantánea.
2.  **Programar publicaciones** de manera eficiente en múltiples páginas de Facebook.
3.  **Monitorear el crecimiento** de la audiencia (seguidores y fans) con datos reales del Graph API.
4.  **Mantenerse al día** con noticias de tendencia para nunca quedarse sin ideas.

## 🛠️ Stack Tecnológico
- **Frontend**: Next.js 15+ (App Router), TailwindCSS, Lucide React (Iconos).
- **Backend / DB**: Supabase (PostgreSQL, Auth, Storage).
- **IA**: OpenAI API (GPT-4) para la síntesis de noticias y creación de posts.
- **Integraciones**: Facebook Graph API para sincronización de páginas y analíticas.
- **Internacionalización**: Sistema propio de i18n (Context API) con soporte para Español e Inglés.

## 🚀 Funcionalidades Implementadas

| Funcionalidad | Descripción | Estado |
| :--- | :--- | :--- |
| **Landing Page Premium** | Diseño moderno con modo oscuro, brillos y carrusel automático. | ✅ Completado |
| **Sistema de Idiomas** | Selector de idioma (ES/EN) persistente en todo el sistema. | ✅ Completado |
| **Auth con Facebook** | Inicio de sesión y sincronización de permisos de páginas. | ✅ Completado |
| **Sincronización de Páginas** | Conexión automática de todas las páginas que administra el usuario. | ✅ Completado |
| **Seguimiento de Audiencia** | Visualización de Seguidores/Fans y guardado de historial. | ✅ Completado |
| **Estudio de Contenido IA** | Generador de ideas y posts basado en prompts de usuario. | ✅ Completado |
| **Panel de Noticias** | Buscador de noticias en tendencia transformables en posts por IA. | ✅ Completado |
| **Programador (Scheduler)** | Calendario de publicaciones con estados de "Programado" y "Publicado". | ✅ Completado |

## 📂 Estructura del Proyecto
- `/src/app`: Rutas de la aplicación (Dashboard, Auth, Landing).
- `/features`: Lógica modular por funcionalidad (Auth, Scheduler, Pages, News).
- `/repositories`: Capa de datos y acceso a Supabase (Clean Architecture).
- `/services`: Integraciones externas (OpenAI, Facebook Graph API).
- `/components`: Componentes de UI reutilizables (Card, Button, Badge, etc.).
- `/lib/i18n`: Sistema de traducción y archivos `json` de idiomas.

## 📈 Lo que llevamos hecho hoy
Hoy hemos logrado que la plataforma sea verdaderamente inteligente y global:
- **Rebranding completo**: El sistema ahora tiene la identidad visual y nombre definitivos.
- **Automatización**: Pasamos de una conexión de páginas manual a una sincronización OAuth automática.
- **Analíticas**: Ahora el usuario puede ver cuánta gente le sigue directamente desde su dashboard.
- **Estabilidad**: El sistema de noticias ahora es resistente a fallos de API externas.
