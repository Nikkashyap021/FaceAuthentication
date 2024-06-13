const multer = require('multer');
const imageModel = require('../models/imageScan.model');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const faceapi = require('face-api.js');
const canvas = require('canvas');
require('dotenv').config();

// Face detection options
const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

// Load face detection and recognition models
const loadModels = async () => {
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./node_modules/face-api.js/weights');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./node_modules/face-api.js/weights');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./node_modules/face-api.js/weights');
  console.log('Face detection and recognition models loaded');
};

// Function to upload an image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const img = await canvas.loadImage(req.file.buffer);
    const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      return res.status(400).send('No faces detected in the image.');
    }

    const faceData = detections.map(detection => {
      const landmarks = detection.landmarks;
      return {
        descriptor: detection.descriptor,
        landmarks: {
          nose: landmarks.getNose(),
          mouth: landmarks.getMouth(),
          leftEye: landmarks.getLeftEye(),
          rightEye: landmarks.getRightEye(),
          // Check if cheek landmarks are available before accessing them
          leftCheek: landmarks.getLeftCheek ? landmarks.getLeftCheek() : null,
          rightCheek: landmarks.getRightCheek ? landmarks.getRightCheek() : null,
          lips: landmarks.getMouth()  // Storing lips landmarks separately
        }
      };
    });

    const newImage = await imageModel.create({
      profileImgURL: req.file.originalname,
      contentType: req.file.mimetype,
      image: req.file.buffer,
      faceData: faceData
    });

    await newImage.save();
    res.status(201).send('Image uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image.');
  }
};


// Function to compare landmarks
const compareLandmarks = (landmarks1, landmarks2) => {
  let matchCount = 0;

  const comparePoints = (points1, points2) => {
    if (!points1 || !points2 || points1.length !== points2.length) {
      return; // Return if any of the points arrays are undefined or have different lengths
    }

    const threshold = 10; // Distance threshold for considering points as matching
    for (let i = 0; i < points1.length; i++) {
      if (!points1[i] || !points2[i]) {
        continue; // Skip if any of the points are undefined
      }
      const distance = Math.sqrt(
        Math.pow(points1[i].x - points2[i].x, 2) + Math.pow(points1[i].y - points2[i].y, 2)
      );
      if (distance < threshold) {
        matchCount++;
      }
    }
  };

  comparePoints(landmarks1?.nose, landmarks2?.nose);
  comparePoints(landmarks1?.mouth, landmarks2?.mouth);
  comparePoints(landmarks1?.leftEye, landmarks2?.leftEye);
  comparePoints(landmarks1?.rightEye, landmarks2?.rightEye);
  comparePoints(landmarks1?.leftCheek, landmarks2?.leftCheek);
  comparePoints(landmarks1?.rightCheek, landmarks2?.rightCheek);
  comparePoints(landmarks1?.lips, landmarks2?.lips);

  return matchCount;
};

// Function to match faces in an image with faces in the database
const matching = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Load the image from the uploaded file
    const img = await canvas.loadImage(req.file.buffer);

    // Detect faces and extract landmarks and descriptors
    const detections = await faceapi.detectAllFaces(img, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors();

    if (detections.length === 0) {
      return res.status(400).send('No faces detected in the image.');
    }

    // Assuming there's only one face in the uploaded image
    const queryDescriptor = detections[0].descriptor;

    // Fetch all faces from the database
    const dbFaces = await imageModel.find({});

    let matchFound = false;
    for (let dbFace of dbFaces) {
      for (let data of dbFace.faceData) {
        const dbDescriptor = data.descriptor;
        const matchCount = compareDescriptors(queryDescriptor, dbDescriptor);

        // If more than 3 landmarks match, consider it a successful match
        if (matchCount > 3) {
          matchFound = true;
          break;
        }
      }
      if (matchFound) {
        break; // Exit the loop if a match is found
      }
    }

    if (matchFound) {
      res.status(200).send('Match found in the database!');
    } else {
      res.status(404).send('No match found.');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image.');
  }
};

// Function to compare face descriptors
// Function to compare face descriptors
const compareDescriptors = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length === 0 || descriptor2.length === 0) {
    return 0; // Return 0 if either descriptor is undefined or empty
  }

  let matchCount = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    // Check if both descriptors have the same length
    if (!descriptor1[i] || !descriptor2[i] || descriptor1[i].length !== descriptor2[i].length) {
      continue; // Skip if any descriptor component is undefined or has different length
    }

    // Compare each component of the descriptor vectors
    const distance = faceapi.euclideanDistance(descriptor1[i], descriptor2[i]);
    if (distance < 0.6) { // Adjust threshold as needed
      matchCount++;
    }
  }
  return matchCount;
};


module.exports = { uploadImage, matching, upload, loadModels };
