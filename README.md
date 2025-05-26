<h1>🧠 Face Recognition API with Node.js and face-api.js</h1>

<p>This project is an Express.js-based REST API for facial image uploading, detection, and face matching using <code>face-api.js</code> and MongoDB.</p>

<h2>✨ Features</h2>
<ul>
  <li>📤 Upload an image and extract face descriptors & landmarks.</li>
  <li>🧬 Compare an uploaded face against stored face data in the database.</li>
  <li>🤖 Use <code>face-api.js</code> for face detection and recognition.</li>
  <li>💾 Store image data and face landmarks in MongoDB.</li>
  <li>📦 Uses <code>Multer</code> for in-memory file handling.</li>
</ul>

<h2>🛠 Technologies Used</h2>
<ul>
  <li>🟩 Node.js</li>
  <li>🚀 Express.js</li>
  <li>🧠 face-api.js</li>
  <li>🍃 MongoDB (via Mongoose)</li>
  <li>🗂️ Multer</li>
  <li>🖼️ canvas (for Node environment image processing)</li>
  <li>🔐 dotenv</li>
</ul>

<h2>📦 Installation</h2>

<h3>🔧 Prerequisites</h3>
<ul>
  <li>Node.js & npm</li>
  <li>MongoDB (running locally or remotely)</li>
</ul>

<h3>📥 Clone the repository</h3>

<pre><code>git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
</code></pre>

<h3>📦 Install dependencies</h3>

<pre><code>npm install
</code></pre>

<h3>🔐 Environment Setup</h3>
<p>Create a <code>.env</code> file in the root directory:</p>

<pre><code>MONGO_URI=mongodb://localhost:27017/your-db-name
</code></pre>

<h3>📁 Load Face-api.js Models</h3>
<p>Download the required <code>face-api.js</code> models and place them in:</p>

<pre><code>node_modules/face-api.js/weights</code></pre>

<p>You can download them from the official repo:  
👉 <a href="https://github.com/justadudewhohacks/face-api.js-models">face-api.js-models</a></p>

<h2>▶️ Usage</h2>

<h3>🚀 Start the Server</h3>

<pre><code>node img.js
</code></pre>

<p>Server will run on <code>http://localhost:8000</code>.</p>

<h2>📡 API Endpoints</h2>

<h3>📤 Upload Image</h3>

<p><strong>POST</strong> <code>/upload</code>  
<br>Upload an image and store facial descriptors and landmarks in MongoDB.</p>

<p><strong>Form-data Body:</strong></p>
<ul>
  <li><code>file</code>: (image file)</li>
</ul>

<p><strong>Response:</strong></p>
<ul>
  <li>✅ <code>201 Created</code> on success</li>
  <li>⚠️ <code>400 Bad Request</code> if no face found</li>
  <li>❌ <code>500 Internal Server Error</code> on failure</li>
</ul>

<h3>🔍 Match Image</h3>

<p><strong>POST</strong> <code>/match</code>  
<br>Compare an uploaded image against stored faces in the database.</p>

<p><strong>Form-data Body:</strong></p>
<ul>
  <li><code>file</code>: (image file)</li>
</ul>

<p><strong>Response:</strong></p>
<ul>
  <li>✅ <code>200 OK</code> if match found</li>
  <li>🚫 <code>404 Not Found</code> if no match</li>
  <li>❌ <code>500 Internal Server Error</code> on failure</li>
</ul>

<h2>📁 File Structure</h2>

<pre><code>.
├── controllers/
│   └── image.js
├── models/
│   └── imageScan.model.js
├── Route/
│   └── imageRout.js
├── config/
│   └── mongodb.js
├── img.js
├── .env
├── package.json
└── README.md
</code></pre>

<h2>📌 Notes</h2>
<ul>
  <li>📂 Ensure face-api.js models are correctly placed in <code>node_modules/face-api.js/weights</code> or modify the path in <code>loadModels()</code> accordingly.</li>
  <li>🧠 This uses memory storage via <code>Multer</code>, which is suitable for small images. For larger image sizes or production usage, consider using disk or cloud storage (e.g., AWS S3).</li>
</ul>

<h2>🪪 License</h2>
<p>MIT</p>
