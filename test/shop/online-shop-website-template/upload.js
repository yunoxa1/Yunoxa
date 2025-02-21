require("dotenv").config();
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");

const app = express();
const PORT = 3000;

// Set up Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Authenticate Google Drive API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Use the refresh token to authenticate
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload Image to Google Drive
async function uploadFileToDrive(filePath, fileName) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: "image/jpeg",
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder ID in Google Drive
      },
      media: {
        mimeType: "image/jpeg",
        body: fs.createReadStream(filePath),
      },
    });

    // Make the file public
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get the public URL
    const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}

// Express Route to Upload an Image
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadFileToDrive(req.file.path, req.file.originalname);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
