# Excel to Word Document Generator Application

## Overview

This application is designed to transform Excel spreadsheets into formatted Word documents for delivery lists. It focuses specifically on converting structured Excel data into properly formatted Word documents with customization options. The application has a React frontend for user interaction and an Express backend for processing files and storing generation statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture:

1. **Frontend**: A React application built with TypeScript, using a modern component-based architecture with shadcn/ui components for the UI.

2. **Backend**: An Express.js server that provides API endpoints for template management and document generation statistics.

3. **Database**: Uses Drizzle ORM with a PostgreSQL database (provisioned via Replit) for data persistence.

4. **API**: RESTful API endpoints handle communication between frontend and backend.

The application's state management on the frontend uses React Query for API data fetching and local state for UI interactions. The backend uses Express.js middleware for request processing and basic logging.

## Key Components

### Frontend Components

1. **File Upload**: Allows users to select and upload Excel files for processing with configuration options.

2. **Processing Status**: Shows real-time progress and status updates during document generation.

3. **Result Screen**: Displays successful document generation with download options.

4. **Error Screen**: Handles and displays processing errors with suggestions for resolution.

5. **UI Components**: Utilizes shadcn/ui component library, which is built on Radix UI primitives, for a consistent design system.

### Backend Components

1. **Express Server**: Handles HTTP requests and serves the frontend in production.

2. **Storage Module**: Provides database access abstraction for templates and document generation history.

3. **API Routes**: Defined routes for managing templates and document generation statistics.

### Data Processing

1. **Excel Processor**: Parses Excel files, validates their structure, and extracts relevant data.

2. **Word Generator**: Converts processed data into formatted Word documents using the docx library.

## Data Flow

1. **User Input**: User uploads an Excel file through the UI and selects configuration options.

2. **Frontend Processing**: 
   - The Excel file is read and processed client-side
   - Data is extracted, sorted, and formatted
   - Progress is reported to the user

3. **Document Generation**:
   - Processed data is used to generate a Word document
   - The document is made available for download

4. **Statistics Storage**:
   - Generation statistics are sent to the backend
   - Backend stores this information in the database

5. **History Retrieval**:
   - Users can view previous document generation history
   - Statistics about past generations are displayed

## External Dependencies

### Frontend Dependencies

1. **React + TypeScript**: Core frontend framework
2. **Tailwind CSS**: Utility-first CSS framework for styling
3. **shadcn/ui + Radix UI**: Component library for UI elements
4. **React Query**: Data fetching and server state management
5. **xlsx**: Excel file processing library
6. **docx**: Word document generation library
7. **file-saver**: File download utility

### Backend Dependencies

1. **Express**: Web server framework
2. **Drizzle ORM**: Database ORM for PostgreSQL
3. **Drizzle-zod**: Schema validation for Drizzle

## Database Schema

The application uses three main tables:

1. **users**: Stores user authentication information
   - id (primary key)
   - username (unique)
   - password

2. **excel_templates**: Stores information about Excel templates
   - id (primary key)
   - name
   - description
   - defaultRowsPerPage
   - createdAt
   - updatedAt

3. **generated_documents**: Tracks document generation history
   - id (primary key)
   - filename
   - stats (JSON stringified statistics)
   - createdAt

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**: 
   - `npm run dev` - Runs both the backend server and frontend dev server

2. **Production Build**:
   - `npm run build` - Builds both frontend and backend for production
   - `npm run start` - Runs the production build

3. **Database Migrations**:
   - `npm run db:push` - Updates the database schema

The .replit configuration specifies:
- Using nodejs-20, web, and postgresql-16 modules
- Port mapping from 5000 (local) to 80 (external)
- Autoscaling deployment target

## Adding New Features

When adding new features:

1. **Frontend Changes**:
   - Add components to `client/src/components`
   - Update pages in `client/src/pages`
   - Add new types to `client/src/types`

2. **Backend Changes**:
   - Add new routes to `server/routes.ts`
   - Update storage operations in `server/storage.ts`
   - Add schema changes to `shared/schema.ts`

3. **Database Changes**:
   - Update schema in `shared/schema.ts`
   - Run `npm run db:push` to update the database