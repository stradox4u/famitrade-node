const AWS = require('aws-sdk')
const db = require('../../models')

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

exports.removeOrphanedImages = (bucketName) => {
  return s3.listObjects({
    Bucket: bucketName
  }, (err, data) => {
    if (err) {
      console.log(err)
      throw err
    }
    data.Contents.map(el => {
      el.url = 'https://farmitrade-bucket.s3.af-south-1.amazonaws.com/' + el.Key
    })
    data.Contents.forEach(async (image) => {
      const user = await db.User.findOne({
        where: {
          avatar: image.url
        }
      })
      if (!user) {
        this.deleteFromAws(image.Key)
      }
    })
  })
}
