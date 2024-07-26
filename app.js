const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();

const imageLists = ['public/uploads/test1', 'public/uploads/test2'];

const convertImage = async (imageName, format) => {
  const supportedFormats = ['jpeg', 'jpg', 'png'];

  if (!supportedFormats.includes(format)) {
    throw new Error('Invalid format. Supported formats are jpeg, jpg, and png.');
  }

  const inputPath = path.join(__dirname, `${imageName}.webp`);
  const outputPath = path.join(__dirname, 'converted', `${path.basename(imageName)}.${format}`);

  try {
    // Ensure the converted directory exists
    if (!fs.existsSync(path.join(__dirname, 'converted'))) {
      fs.mkdirSync(path.join(__dirname, 'converted'));
    }

    await sharp(inputPath)
      .toFormat(format)
      .toFile(outputPath);

    console.log(`Converted ${imageName}.webp to ${path.basename(outputPath)}`);
    return outputPath;
  } catch (error) {
    console.error('Error processing the image:', error);
    throw new Error('Internal Server Error');
  }
};

const convertImages = async (imageList, format) => {
  for (const image of imageList) {
    try {
      await convertImage(image, format);
    } catch (error) {
      console.error(`Failed to convert ${image}:`, error.message);
    }
  }
};

app.listen(3000, async () => {
  console.log('Server is running on port 3000');

  const format = 'jpeg'; // Change to 'jpg' or 'png' as needed
  await convertImages(imageLists, format);
});
