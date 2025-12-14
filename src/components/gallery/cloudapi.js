import express from 'express';
import cors from 'cors';
import cloudinary from "cloudinary";
//import { v2 } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: "dow6mrkpm",
  api_key: "186329281539576",
  api_secret: "USUgBE_52uDSEDJFpTcyu3zmcAg"
});

// Test Cloudinary configuration
try {
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Cloudinary configuration error:', error);
}

app.get("/images", async (req, res) => {
  const folder = "riro";

  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${folder}`)
      .max_results(100)
      .execute();

    console.log(result);
    res.json(result.resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/folders", async (req, res) => {
  try {
    const result = await cloudinary.v2.api.sub_folders("riro");
    res.json(result.folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/galleries", async (req, res) => {
  try {
    const foldersResult = await cloudinary.v2.api.sub_folders("riro");

    const galleries = await Promise.all(
      foldersResult.folders.map(async (folder) => {
        // Search for a thumbnail image in this folder
        const searchResult = await cloudinary.v2.search
          .expression(`folder:${folder.path} AND public_id:thumbnail*`)
          .max_results(1)
          .execute();

        // Use the found thumbnail or fallback
        const thumbnailPublicId = searchResult.resources?.[0]?.public_id || `${folder.path}/thumbnail_a2m8vf`;

        return {
          id: folder.name,
          title: folder.name,
          folder: folder.path,
          thumbnail: thumbnailPublicId,
          description: 'Behind the scenes of our latest film productions',
        };
      })
    );

    console.log("✅ Galleries loaded:", galleries);
    res.json(galleries);
  } catch (err) {
    console.error("❌ Gallery error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/gallery/:folder", async (req, res) => {
  const folderPath = `riro/${req.params.folder}`;

  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${folderPath}`)
      .sort_by("created_at", "asc")
      .max_results(100)
      .execute();

    res.json(result.resources);
  } catch (err) {
    console.error("❌ Gallery fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});


const filePath = path.join(process.cwd(), 'src/components/gallery/teamData.json');
const projectsPath = path.join(process.cwd(), 'src/components/gallery/projectsData.json');
const teamImagesPath = path.join(process.cwd(), 'src/assets/teampage');

// Ensure team images directory exists
try {
  if (!fs.existsSync(teamImagesPath)) {
    fs.mkdirSync(teamImagesPath, { recursive: true });
    console.log('Team images directory created:', teamImagesPath);
  }
} catch (error) {
  console.error('Error creating team images directory:', error);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, teamImagesPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `team-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});
app.get('/api/team', (req, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read team data' });
  }
});

/* ✅ Save team data */
app.post('/api/team/save', (req, res) => {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save team data' });
  }
});

/* ✅ Upload team member image */
app.post('/api/team/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary with cache-busting
    const timestamp = Date.now();
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      //folder: 'riro/team',
      folder: 'team',
      public_id: `team-${timestamp}`,
      resource_type: 'image',
      invalidate: true, // Invalidate CDN cache
      overwrite: true
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    // Add cache-busting parameter to URL
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

// Ensure projects data file exists
try {
  if (!fs.existsSync(projectsPath)) {
    fs.writeFileSync(projectsPath, JSON.stringify({}));
    console.log('Projects data file created:', projectsPath);
  }
} catch (error) {
  console.error('Error creating projects data file:', error);
}

// Get projects data
app.get('/api/projects', (req, res) => {
  try {
    const data = fs.readFileSync(projectsPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects data' });
  }
});

// Save projects data
app.post('/api/projects/save', (req, res) => {
  try {
    fs.writeFileSync(
      projectsPath,
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save projects data' });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
