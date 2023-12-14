var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody");

//Require Product from Models
const Product = require('../models/products')

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Creation new Product
// Default category ID
const defaultCategoryId = "657ab87025ea6d64cea475e6";

//Creation new Product
router.post('/newProduct', (req, res)=> {
  Product.findOne({name: req.body.name})
  //Bringing categories
  .populate('category')
  .then(data => {
    console.log(data)
    //Checking if product already exists
    if(data === null) {
        //If not existing = Creation
        const newProduct = new Product({
            name: req.body.name,
            image: req.body.image,
            // default to 0 if not provided
            stock: req.body.stock,
            price: req.body.price,
            // default to empty array if not provided
            // [{ date: currentDate, quantity: JSON.parse(req.body.soldAt).quantity }]
            // soldAt: req.body.soldAt ? { date: currentDate, quantity: JSON.parse(req.body.soldAt).quantity } : [],
            //soldAt: req.body.soldAt ? JSON.parse(req.body.soldAt) : [],
            // default to empty array if not provided
            // restockAt: req.body.restockAt ? JSON.parse(req.body.restockAt) : [], 
            category: req.body.category || defaultCategoryId, // default category if not provided
        })
        //Saving of the Product
        newProduct.save().then(newProduct => {
            res.json({result: true, newProduct})
        })
    }else{
        //Product already exists
        res.json({result: false, error: 'Product already exists'})
    }
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//  Modification new Product        //
///////////////////////////////////////////////////////////////////////////////////////////////////////
// Route de base à conserver        //
// Pour toute modification Admin    //
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.put('/updateProduct/:name', async (req, res) => {

    // Check if name is provided
    if (!req.params.name) {
        return res.json({result: false, error: 'Name is required'});
    }

    //Regex // ou checkbody

    const name = req.params.name;
    const updatedProduct = {
      name: req.body.name,
      image: req.body.image,
      //stock: req.body.stock,
      //soldAt: JSON.parse(req.body.soldAt),
      //restockAt: JSON.parse(req.body.restockAt),
      category: req.body.category,
    };
  
    try {
      // Ask findOneAndUpdate to return the updated document
      // First parameter is the Search's Object / Object who hold new information
      // new: true specify to send the new version of the doc instead of the original
      const product = await Product.findOneAndUpdate({ name: name }, updatedProduct, { new: true })
      .populate('category');
      if (product) {
        res.json({ result: true, product });
      } else {
        res.json({ result: false, error: 'Product not found' });
      }
    } catch (error) {
      res.json({ result: false, error });
    }
  });

//////////////////////////
//Update Stock Only
//Data format number only
router.put('/updateStockProduct/:name', async (req, res) => {
    const name = req.params.name;
    const updatedProduct = {

      stock: req.body.stock,

    };
  
    try {
        // Ask findOneAndUpdate to return the updated document
        // First parameter is the Search's Object / Object who hold new information
        // new: true specify to send the new version of the doc instead of the original
        const product = await Product.findOneAndUpdate({ name: name }, updatedProduct, { new: true })
        .populate('category');
        if (product) {
            res.json({ result: true, product });
        } else {
            res.json({ result: false, error: 'Product not found' });
        }
        } catch (error) {
            res.json({ result: false, error });
        }
  });

//////////////////////////
//Update soldAt Only
//Data format [{"date":"YYYY/MM/DD","quantity":X}]
router.put('/updateSoldAtProduct/:name', async (req, res) => {
    const name = req.params.name;
    const updatedProduct = {

      soldAt: JSON.parse(req.body.soldAt),

    };
  
    try {
        // Ask findOneAndUpdate to return the updated document
        // First parameter is the Search's Object / Object who hold new information
        // new: true specify to send the new version of the doc instead of the original
        const product = await Product.findOneAndUpdate({ name: name }, updatedProduct, { new: true })
        .populate('category');
        if (product) {
            res.json({ result: true, product });
        } else {
            res.json({ result: false, error: 'Product not found' });
        }
        } catch (error) {
        res.json({ result: false, error });
        }
  });

//////////////////////////
//Update restockAt Only
//Data format [{"date":"YYYY/MM/DD","quantity":X}]
router.put('/updateRestockAtProduct/:name', async (req, res) => {
    const name = req.params.name;
    const updatedProduct = {

      restockAt: JSON.parse(req.body.restockAt),

    };
  
    try {
        // Ask findOneAndUpdate to return the updated document
        // First parameter is the Search's Object / Object who hold new information
        // new: true specify to send the new version of the doc instead of the original
        const product = await Product.findOneAndUpdate({ name: name }, updatedProduct, { new: true })
        .populate('category');
        if (product) {
            res.json({ result: true, product });
        } else {
            res.json({ result: false, error: 'Product not found' });
        }
        } catch (error) {
        res.json({ result: false, error });
        }
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Delete route for Product
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete('/deleteProduct/:name', async (req, res) => {
    const name = req.params.name;
  
    try {
        // Ask findOneAndUpdate to return the updated document
        const product = await Product.findOneAndDelete({ name: name })
        .populate('category');
        if (product) {
            res.json({ result: true, message: 'Product deleted successfully' });
        } else {
            res.json({ result: false, error: 'Product not found' });
        }
        } catch (error) {
        res.json({ result: false, error });
        }
  });


///////////////////////////////////////////////////////////////////////////////////////////////////////
//GET All Products
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/allProducts', (req, res) => {
    //GET All Products
    Product.find()
    .populate('category')
    .then(data => {
        if (data.length > 0) {
            res.json({ result: true, allProducts: data });
        } else {
            res.json({ result: false, error: 'No Products found' });
        }
    });
});

//////////////////////////
//GET By ID Product
router.get('/', (req, res) => {
    //Const for parameter Id
    const id = req.params.id;
    //Searching par Id
    Product.findOne({ _id: id }).then(data => {
        if (data) {
        res.json({ result: true, allCategory :[] });
        } else {
        res.json({ result: false, error: 'Product not found' });
        } 
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Get selling by periode
///////////////////////////////////////////////////////////////////////////////////////////////////////
//GET Selling By Present Day
router.get('/salesToday', (req, res) => {
    //Get the date of to day
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    //Get the date of tomorrow
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    Product.aggregate([
        //$unwind go in object array of soldAt
        { $unwind: "$soldAt" },
        //$match find and get the date
        //$gte egal to or greater than
        //$lt egal to or less than
        { $match: { "soldAt.date": { $gte: today, $lt: tomorrow } } },
        //$group the name of article and quantity
        { $group: { _id: "$name", total: { $sum: "$soldAt.quantity" } } }
    ])
    .then(data => {
        if (data.length > 0) {
            res.json({ result: true, salesToday: data });
        } else {
            res.json({ result: false, error: 'No sales found for today' });
        }
    })
    .catch(error => {
        res.json({ result: false, error });
    });
});

////////////////////////////
//GET Selling By Present Week
router.get('/salesOfTheWeek', (req, res) => {
    //Get the date of to Week
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    //Get the date 7 days later
    let week = new Date(today);
    week.setDate(week.getDate() + 7);

    Product.aggregate([
        //$unwind go in object array of soldAt
        { $unwind: "$soldAt" },
        //$match find and get the date
        //$gte egal to or greater than
        //$lt egal to or less than
        { $match: { "soldAt.date": { $gte: today, $lt: week } } },
        //$group the name of article and quantity
        { $group: { _id: "$name", total: { $sum: "$soldAt.quantity" } } }
    ])
    .then(data => {
        if (data.length > 0) {
            res.json({ result: true, salesOfTheWeek: data });
        } else {
            res.json({ result: false, error: 'No sales found for today' });
        }
    })
    .catch(error => {
        res.json({ result: false, error });
    });
});

////////////////////////////
//GET Selling By Present Month
router.get('/salesOfTheMonth', (req, res) => {
    //Get the date of to Month
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    //Get the date 30 days later
    let month = new Date(today);
    month.setDate(month.getDate() + 30);

    Product.aggregate([
        //$unwind go in object array of soldAt
        { $unwind: "$soldAt" },
        //$match find and get the date
        //$gte egal to or greater than
        //$lt egal to or less than
        { $match: { "soldAt.date": { $gte: today, $lt: month } } },
        //$group the name of article and quantity
        { $group: { _id: "$name", total: { $sum: "$soldAt.quantity" } } }
    ])
    .then(data => {
        if (data.length > 0) {
            res.json({ result: true, salesOfTheWeek: data });
        } else {
            res.json({ result: false, error: 'No sales found for today' });
        }
    })
    .catch(error => {
        res.json({ result: false, error });
    });
});





// Route ajout stock
router.put('/addStock/:name/:stock', (req, res) => {
    const todayDate = new Date();
    Product.findOne({name: req.params.name})
    .then(data => {
        console.log(data.stock)
        Product.updateOne({name: req.params.name}, {stock: parseInt(data.stock) + parseInt(req.params.stock), $push: { restockAt: {date: todayDate, quantity: req.params.stock}}})
        .then(() => {
            Product.find().then(() => { res.json({ result: true, message: "stock added"});
            });
        });
    });
});

// Route sortie de stock stock
router.put('/sell/:name/:stock', (req, res) => {
    const todayDate = new Date();
    Product.findOne({name: req.params.name})
    .then(data => {
        Product.updateOne({name: req.params.name}, {stock: parseInt(data.stock) - parseInt(req.params.stock), $push: { soldAt: {date: todayDate, quantity: req.params.stock}}})
        .then(() => {
            Product.find().then(() => { res.json({ result: true, message: "stock added"});
            });
        });
    })
});


// Route update d'un produit
router.put('/updateMyProduct/:name', (req, res) => {
    Product.findOne({name: req.params.name})
    .then(data => {
        Product.updateOne({name: req.params.name}, {name: req.body.name, image: req.body.image, category: req.body.category, price: req.body.price})
        .then(() => {
            Product.find().then(() => { res.json({ result: true, updatedProduct: data});
            });
        });
    })
});


// Route qui retourne tous les produits d'une category
router.post('/productsByCategoryId', (req, res) => {
    Product.find({category: req.body.categoryId})
    .then(data => {
        console.log(req.body.categoryId)
        console.log(data)
        if (data.length > 0) {
            res.json({ result: true, allProducts: data });
        } else {
            res.json({ result: false, error: 'No Products found' });
        }
    });
});


module.exports = router;