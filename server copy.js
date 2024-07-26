const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const imageLists = ['1721945567537.jpg', '1721945567680.jpg','1721945567798.jpg']
const texts = ['This is a new book', 'This is second line', 'That makes that third line']


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/generate_pdf', upload.array('images', 10), (req, res) => {
  const { title, texts } = req.body;
  const images = req.files.map(file => file.path);

  const doc = new PDFDocument({ autoFirstPage: false });
  const pdfPath = path.join(__dirname, 'public', 'uploads', `${Date.now()}.pdf`);

  doc.pipe(fs.createWriteStream(pdfPath));

  doc.addPage()
    .fontSize(25)
    .text(title, { align: 'center' });

  images.forEach((imagePath, index) => {
    doc.addPage();
    doc.image(imagePath, {
      fit: [doc.page.width, doc.page.height - 100],
      align: 'center',
      valign: 'top'
    });
    doc.moveDown();
    doc.fontSize(12).text(texts[index], {
      align: 'center',
      width: doc.page.width - 40,
      continued: false
    });
  });

  doc.end();

  doc.on('finish', () => {
    res.json({ pdfUrl: `/uploads/${path.basename(pdfPath)}` });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
