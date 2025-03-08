const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Google Drive setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes required for Google Drive access
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Ensure the "uploads" folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Handle file upload and upload to Google Drive
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  
  try {
    // Authenticate the user with Google API
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Upload the file to Google Drive
    const fileMetadata = { name: req.file.filename };
    const media = { body: fs.createReadStream(filePath) };
    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // Get the file URL from Google Drive response
    const fileUrl = driveResponse.data.webViewLink;

    // Save the file URL to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([{ image: fileUrl }]);

    if (error) throw error;

    // Send success response
    res.send(`File uploaded successfully. Image URL stored in Supabase: ${fileUrl}`);

    // Clean up the uploaded file from local disk
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// Route to handle serving the index page (basic HTML form for uploading)
app.get('/', (req, res) => {
  res.send(`
    <form ref='uploadForm' 
      id='uploadForm' 
      action='/upload' 
      method='post' 
      encType="multipart/form-data">
        <input type="file" name="file" />
        <input type='submit' value='Upload!' />
    </form>
  `);
});

// Route to serve the shop page with images from Supabase
app.get('/shop', async (req, res) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, image'); // Assuming your Supabase table is called 'products' and has an 'image' column

  if (error) {
    return res.status(500).send('Error fetching products');
  }

  let productListHTML = products.map(product => {
    return `<div><img src="${product.image}" alt="Product Image" width="200"/></div>`;
  }).join('');

  res.send(`
    <h1>Shop</h1>
    ${productListHTML}
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
