const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
   name:String,
   image:String
  });
  
  const Category = mongoose.model('categories', productSchema);
  
  module.exports =  Category;