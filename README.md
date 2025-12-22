# Riro Talehouse Website

A modern production house website showcasing films, team members, and creative projects.

## Project Structure

```
riro_website/
├── backend/                 # Node.js API server
│   ├── cloudapi.js         # Main server file
│   ├── package.json        # Backend dependencies
│   ├── teamData.json      # Team members data
│   └── projectsData.json  # Projects data
├── frontend/              # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json       # Frontend dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start backend server:
```bash
npm run dev
```
The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## API Endpoints

### Team Management
- `GET /api/team` - Get all team data
- `POST /api/team/save` - Save team data
- `POST /api/team/upload` - Upload team member images

### Projects Management
- `GET /api/projects` - Get all projects data
- `GET /api/projects/:season` - Get projects by season
- `POST /api/projects/save` - Save projects data

### Gallery Management
- `GET /api/galleries` - Get all galleries
- `GET /api/gallery/:folder` - Get images from specific gallery

### System
- `GET /api/health` - Health check endpoint

## Deployment

### Backend Deployment
1. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=3001` (or your preferred port)

2. Install production dependencies:
```bash
npm install --production
```

3. Start server:
```bash
npm start
```

### Frontend Deployment
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Cloudinary Configuration
The application uses Cloudinary for image storage. Configuration:
- Cloud name: `dow6mrkpm`
- API credentials are stored in the backend server

## Features

- **Team Management**: Dynamic team member profiles with image upload
- **Project Showcase**: Categorized projects by type (short films, feature films, etc.)
- **Gallery System**: Photo galleries with Cloudinary integration
- **Admin Panel**: Content management system for updating team and projects
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with React, Tailwind CSS, and modern design patterns

## Development

### Adding New Team Members
1. Access the admin panel at `/admin/login`
2. Navigate to Team Management
3. Add or edit team members with images

### Adding New Projects
1. Access the admin panel
2. Navigate to Service Cards
3. Select the service category and add new projects

### Image Upload
Images are automatically uploaded to Cloudinary and optimized for web delivery.

## Support

For technical support or questions about the website, please contact the development team.
