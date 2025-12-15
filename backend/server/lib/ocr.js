// Lightweight OCR stub; replace with Tesseract or provider API in production
const path = require('path');

async function extractText(filePath) {
  // Simulate OCR by returning file name parts
  const base = path.basename(filePath || '');
  return `OCR_TEXT:${base}`;
}

async function verifyDocument({ filePath, type }) {
  const text = await extractText(filePath);
  const ok = !!text && text.length > 8;
  return { verified: ok, textSample: text, type };
}

module.exports = { extractText, verifyDocument };