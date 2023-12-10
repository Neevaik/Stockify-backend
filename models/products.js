const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    name: String,
    image:String,
    stock:Number,
    soldAt:[{date:Date,quantity:Number}],
    restockAt: [{date:Date,quantity:Number}],
  });
  
  const Product = mongoose.model('products', productSchema);
  
  module.exports = Product;