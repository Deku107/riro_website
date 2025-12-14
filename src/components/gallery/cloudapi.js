import express from "express";
import cloudinary from "cloudinary";
import cors from "cors";
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: "dow6mrkpm",
  api_key: "186329281539576",
  api_secret: "USUgBE_52uDSEDJFpTcyu3zmcAg"
});

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
    // Get subfolders inside "riro"
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
// Print the response in the console
    console.log("Galleries response:", JSON.stringify(galleries, null, 2));

    res.json(galleries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/gallery/:folder", async (req, res) => {
  const folder = `riro/${req.params.folder}`;

  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${folder}`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();

    res.json(result.resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const filePath = path.join(process.cwd(), 'teamData.json');
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



app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
