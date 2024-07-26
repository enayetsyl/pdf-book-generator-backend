const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const imageLists = ['public/uploads/1721945567537.jpg', 'public/uploads/1721945567680.jpg', 'public/uploads/1721945567798.jpg'];
const texts = ['This is a new book', 'This is the second line', 'That makes the third line'];

const generatePDF = (title, imageLists, texts) => {
  const pageWidth = 842; // A4 landscape width in points
  const pageHeight = 595; // A4 landscape height in points

  const doc = new PDFDocument({
    size: [pageWidth, pageHeight],
    autoFirstPage: false
  });

  const pdfPath = path.join(__dirname, 'public', 'uploads', `${Date.now()}.pdf`);
  doc.pipe(fs.createWriteStream(pdfPath));

  // Add title page
  doc.addPage({ layout: 'landscape', margin: 0 })
    .fontSize(25)
    .text(title, { align: 'center', valign: 'center' });

  imageLists.forEach((imagePath, index) => {
    doc.addPage({ layout: 'landscape', margin: 0 });

    // Image taking 90% of the page height
    const imageHeight = pageHeight * 0.9;
    const textHeight = pageHeight * 0.1;
    const textPadding = 30; // Padding above the text

    doc.image(imagePath, 0, 0, { width: pageWidth, height: imageHeight });

    // Text taking remaining 10% space at the bottom with padding
    doc.fontSize(36)
      .text(texts[index], 0, imageHeight + textPadding, { align: 'center', width: pageWidth });
  });

  doc.end();

  doc.on('finish', () => {
    console.log(`PDF generated: /uploads/${path.basename(pdfPath)}`);
  });
};

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  const title = "Test PDF Title";
  generatePDF(title, imageLists, texts);
});
