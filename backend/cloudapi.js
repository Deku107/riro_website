const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryApi } = require('@cloudinary/url-gen');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dow6mrkpm',
  api_key: '186329281539576',
  api_secret: 'USUgBE_52uDSEDJFpTcyu3zmcAg'
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Load data files
const teamData = JSON.parse(fs.readFileSync(path.join(__dirname, 'teamData.json'), 'utf8'));
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'projectsData.json'), 'utf8'));

// API Routes
app.get('/api/team', (req, res) => {
  res.json(teamData);
});

app.get('/api/projects', (req, res) => {
  res.json(projectsData);
});

app.get('/api/projects/:season', (req, res) => {
  const season = req.params.season;
  const seasonData = projectsData[season];
  
  if (seasonData) {
    res.json(seasonData);
  } else {
    res.status(404).json({ error: 'Season not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gallery endpoints
app.get('/api/galleries', async (req, res) => {
  try {
    const result = await cloudinary.v2.api.sub_folders('riro');
    const galleries = await Promise.all(
      result.folders.map(async (folder) => {
        try {
          const searchResult = await cloudinary.v2.search
            .expression(`folder:${folder.path} AND public_id:thumbnail*`)
            .max_results(1)
            .execute();

          const thumbnailPublicId = searchResult.resources?.[0]?.public_id || `${folder.path}/thumbnail_a2m8vf`;

          return {
            id: folder.name,
            title: folder.name,
            folder: folder.path,
            thumbnail: thumbnailPublicId,
            description: 'Behind the scenes of our latest film productions',
          };
        } catch (error) {
          console.error(`Error processing folder ${folder.name}:`, error);
          return {
            id: folder.name,
            title: folder.name,
            folder: folder.path,
            thumbnail: `${folder.path}/thumbnail_a2m8vf`,
            description: 'Behind the scenes of our latest film productions',
          };
        }
      })
    );
    res.json(galleries);
  } catch (err) {
    console.error('Gallery error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/:folder', async (req, res) => {
  const folderPath = `riro/${req.params.folder}`;
  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${folderPath}`)
      .sort_by('created_at', 'asc')
      .max_results(100)
      .execute();
    res.json(result.resources);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Team save endpoint
app.post('/api/team/save', (req, res) => {
  try {
    const updatedData = req.body;
    fs.writeFileSync(
      path.join(__dirname, 'teamData.json'),
      JSON.stringify(updatedData, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Save team data error:', err);
    res.status(500).json({ error: 'Failed to save team data' });
  }
});

// Projects save endpoint
app.post('/api/projects/save', (req, res) => {
  try {
    const updatedData = req.body;
    fs.writeFileSync(
      path.join(__dirname, 'projectsData.json'),
      JSON.stringify(updatedData, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Save projects data error:', err);
    res.status(500).json({ error: 'Failed to save projects data' });
  }
});

// Image upload endpoint
app.post('/api/team/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const timestamp = Date.now();
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'team',
      public_id: `team-${timestamp}`,
      resource_type: 'image',
      invalidate: true,
      overwrite: true
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    const cacheBustingUrl = `${result.secure_url}?t=${timestamp}`;

    res.json({ 
      success: true, 
      imageUrl: cacheBustingUrl,
      publicId: result.public_id,
      timestamp: timestamp
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Serve static files from frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  GET /api/team - Get team data`);
  console.log(`  GET /api/projects - Get all projects data`);
  console.log(`  GET /api/projects/:season - Get projects by season`);
  console.log(`  GET /api/health - Health check`);
});

module.exports = app;
