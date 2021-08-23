const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'af-south-1'
})

exports.deleteFromAws = (objKey) => {
  s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objKey
  }, (err, data) => {
    if (err) {
      console.log(err)
      throw err
    }
  })
}
