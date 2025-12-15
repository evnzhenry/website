const fs = require('fs');
const path = require('path');

let useS3 = false;
let s3Client = null;
let S3_BUCKET = null;

if (process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  useS3 = true;
  const AWS = require('aws-sdk');
  s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  S3_BUCKET = process.env.AWS_S3_BUCKET;
}

async function saveFileLocal(file) {
  // file is multer file object; it is already stored locally in uploads
  return { storage: 'local', path: file.path, filename: file.filename };
}

async function uploadToS3(filePath, key) {
  const body = fs.createReadStream(filePath);
  const params = { Bucket: S3_BUCKET, Key: key, Body: body, ACL: 'private' };
  const result = await s3Client.upload(params).promise();
  return { storage: 's3', url: result.Location, key: key };
}

async function saveFile(file) {
  if (!file) return null;
  if (useS3) {
    const key = `uploads/${Date.now()}-${file.originalname}`;
    return uploadToS3(file.path, key);
  }
  return saveFileLocal(file);
}

module.exports = { saveFile };
