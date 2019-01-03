const express = require('express');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const router = express.Router();
const Item = require('../models/item');

const FileItem = require('../models/fileItem');
const MusicItem = require('../models/musicItem');
const VideoItem = require('../models/videoItem');
const PictureItem = require('../models/pictureItem');
// =========== Answer =============

const s3 = new aws.S3({
  accessKeyId: 'AKIAIOC3LA2JJQAUDI4A',
  secretAccessKey: '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',
  Bucket: 'onion-test'
  // region: 'us-east-2'
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'onion-test',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // console.log(file);
      cb(null, Date.now().toString() + "_" + file.originalname);
    }
  }),
  limits: { fieldSize: 1000 * 1024 * 1024 } 
});

router.post('/add_item', upload.single('file'), (req, res, next) => {
  try {
    if (req.file) {
      const newItem = new Item({
        name: req.file.key,
        author: req.body.author || '',
        fileSize: req.file.size,
        url: req.file.location,
        type: req.body.type,
        description: req.body.description,
        tags: req.body.tags,
        price: req.body.price,
        duration: req.body.duration ? req.body.duration : 0
      });
      Item.addItem(newItem, (err, tempItem) => {
        if (err) {
          console.log('Failed to add Item');
          res.json({ success: false, msg: 'Failed to add Item' });
        } else {
          console.log('Success to add Item');
          res.json({ success: true, msg: 'Success to add Item', item: tempItem });
        }
      });
    } else {
      console.log('Failed to add Item');
      res.json({ success: false, msg: 'Failed to add Item' });
    }
  } catch (error) {
    throw error;
  }
});

router.post('/add_video_item', upload.array('file[]', 2), (req, res, next) => {
  try {
    if (req.files) {
      console.log(req.files);
      const newItem = new Item({
        name: req.files[0].key,
        author: req.body.author || '',
        fileSize: req.files[0].size,
        url: req.files[0].location,
        type: req.body.type,
        description: req.body.description,
        tags: req.body.tags,
        price: req.body.price,
        duration: req.body.duration ? req.body.duration : 0,
        thumb: req.files[1].location
      });
      Item.addItem(newItem, (err, tempItem) => {
        if (err) {
          console.log('Failed to add Item');
          res.json({ success: false, msg: 'Failed to add Item' });
        } else {
          console.log('Success to add Item');
          res.json({ success: true, msg: 'Success to add Item', item: tempItem });
        }
      });
    } else {
      console.log('Failed to add Item');
      res.json({ success: false, msg: 'Failed to add Item' });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.get('/get_items', (req, res, next) => {
  try {
    Item.getAllItems((err, items) => {
      if (err) {
        console.log('Failed to get Items');
        res.json({ success: false, msg: 'Failed to add Item' });
      } else {
        console.log('Success to get Items');
        res.json({ success: true, msg: 'Success to add Item', items });
      }
    });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
