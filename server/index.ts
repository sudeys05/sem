import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { connectToMongoDB } from './mongodb-connection.js';
import { registerMongoDBRoutes } from './mongodb-routes.js';
import { registerEvidenceRoutes } from './evidence-routes.js';
import { setupVite, serveStatic, log } from './vite.js';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { seedGeofiles } from './seed-geofiles.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

dotenv.config();

function maskMongoUri(uri) {
  if (!uri) return "[NOT SET]";
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
}

console.log("Starting Police Management System with MongoDB Atlas...");
console.log(`MONGODB_URI = ${maskMongoUri(process.env.MONGODB_URI)}`);

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

const app = express();
const server = createServer(app);

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.shp', '.kml', '.geojson', '.csv', '.gpx', '.kmz', '.gml'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'police-management-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await connectToMongoDB();
    console.log('✅ MongoDB connected successfully!');

    // Register routes
    registerMongoDBRoutes(app, upload);
    registerEvidenceRoutes(app);

    // Import and register additional routes
    const { registerAdditionalRoutes } = await import('./api-routes.js');
    registerAdditionalRoutes(app);

    // Serve uploaded files statically
    app.use('/uploads', express.static('uploads'));

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mongodb: 'connected'
      });
    });

    if (process.env.NODE_ENV === 'production') {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

    // Seed development data
    await seedGeofiles();

    const port = process.env.PORT || 5000;
    server.listen(port, '0.0.0.0', () => {
      log(`Police Management System running on port ${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`MongoDB Status: Connected`);
      log(`Server accessible at: http://0.0.0.0:${port}`);
      console.log(`🌐 Server is ready and listening on http://0.0.0.0:${port}`);
      console.log(`📱 Replit webview should be accessible now`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

startServer();