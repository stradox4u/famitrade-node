const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'af-south-1'
})

const myMulterS3 = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname })
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString() + '.' + file.mimetype.split('/')[1])
  }
})

module.exports = myMulterS3