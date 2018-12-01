const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: ''
  },
  author: {
    type: String,
    required: false,
    default: ''
  },
  fileSize: {
    type: Number,
    required: false,
    default: 0
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  tags: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: false
  }
});

// console.log("----------Schema-----------");
// console.log(UserSchema);

const FileItem = module.exports = mongoose.model('FileItem', ItemSchema);

module.exports.getItemById = function (id, callback) {
  FileItem.findById(id, callback);
};

module.exports.getAllItems = function (callback) {
  FileItem.find(callback);
};

module.exports.deleteItemById = function (id, callback) {
  Item.findByIdAndDelete(id, callback);
};

module.exports.addItem = function (item, callback) {
  item.save(callback);
};
