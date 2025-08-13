# MedCore Healthcare Management Platform

## Overview

MedCore is a full-stack healthcare management application built with modern web technologies. The platform serves three distinct user roles - administrators, doctors, and patients - each with specialized dashboards and functionality. The system focuses on document management, AI-powered medical analysis through RAG (Retrieval-Augmented Generation), and real-time user monitoring.

The application combines secure document handling with intelligent AI insights to support healthcare professionals in making informed decisions. Administrators manage reference documents and monitor system usage, doctors upload patient documents and receive AI-generated insights, while patients access their medical records and appointments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, utilizing a component-based architecture with shadcn/ui for consistent UI components. The application uses Wouter for client-side routing and TanStack React Query for state management and API communication. The UI follows a healthcare-focused design system with clinical color schemes (blues, whites, mint greens) and role-based theming.

Key frontend decisions include:
- **Component Library**: shadcn/ui provides pre-built, customizable components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom healthcare-themed color variables and responsive design
- **State Management**: React Query handles server state with optimistic updates and caching
- **Routing**: Wouter provides lightweight client-side routing with role-based dashboard redirects
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The backend follows a RESTful API design using Node.js with Express.js. The server implements a layered architecture with separated concerns for routing, business logic, and data access. The storage layer uses an interface-based approach allowing for flexible database implementations.

Core backend architectural choices:
- **Server Framework**: Express.js with TypeScript for type safety and middleware support
- **Authentication**: Replit Auth integration with multi-role JWT-based authentication
- **File Handling**: Multer middleware for document uploads with size limits up to 200MB
- **Database Layer**: Abstracted storage interface with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage for persistent authentication

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM providing type-safe database interactions. The schema supports multi-role authentication, document management with metadata tracking, and real-time session monitoring.

Database design principles:
- **User Management**: Role-based user system supporting admin, doctor, and patient roles
- **Document Storage**: Separate tables for document metadata and file storage with status tracking
- **Session Tracking**: Built-in session storage for authentication and online user monitoring
- **Schema Management**: Drizzle migrations for version-controlled database changes

### Authentication and Authorization
The system implements Replit Auth with OpenID Connect for secure authentication. Role-based access control ensures users only access appropriate functionality. Session management includes real-time online user tracking and automatic session cleanup.

Security implementation:
- **Multi-Role System**: Three distinct user roles with specific permissions and dashboard access
- **Session Security**: HTTP-only cookies with secure flags and configurable expiration
- **Route Protection**: Middleware-based authentication checks on all protected endpoints
- **Real-time Monitoring**: Live session tracking for administrative oversight

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication Services  
- **Replit Auth**: OpenID Connect authentication provider integrated with Replit platform
- **Passport.js**: Authentication middleware with OpenID Connect strategy support

### UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom healthcare theme
- **Lucide Icons**: Consistent icon library for healthcare and general purpose icons
- **TanStack React Query**: Server state management with caching and synchronization

### Development and Build Tools
- **Vite**: Fast development server and build tool with React plugin support
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### File and Media Handling
- **Multer**: Multipart form data handling for file uploads
- **Node.js File System**: Server-side file storage and management

The application is designed to integrate with AI/RAG services for document analysis, though the specific AI provider integration is prepared but not yet implemented in the current codebase.