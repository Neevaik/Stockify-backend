var express = require('express');
var router = express.Router();

//Require du Model de Models
const Product = require('../models/products')

//////////////////////
//Creation new Product
router.post('/newProduct', (req, res) => {
    Product.findOne({ name: req.body.name })
        // Bringing categories
        .populate('category')
        .then(data => {
            // Checking if product already exists
            if (data === null) {
                // If not existing = Creation

                const currentDate = new Date();

                const newProduct = new Product({
                    name: req.body.name,
                    image: req.body.image,
                    stock: req.body.stock,
                    soldAt: [{ date: currentDate, quantity: JSON.parse(req.body.soldAt).quantity }],
                    restockAt: JSON.parse(req.body.restockAt),
                    category: req.body.category,
                })

                // Saving of the Product
                newProduct.save().then(newProduct => {
                    res.json({ result: true, newProduct })
                })
            } else {
                // Product already exists
                res.json({ result: false, error: 'Product already exists' })
            }
        })
});


///////////////////////////////////////////////
//Modification of the Product in fonction of Id
router.put('/updateProduct/:id', (req, res) => {
    //Const for parameter Id
    const id = req.params.id;
    //Update Product's fields
    const updatedProduct = {
      name: req.body.name,
      image: req.body.image,
      stock: req.body.stock,
      soldAt: req.body.soldAt,
      restockAt: req.body.restockAt,
    };
    //Research for Product with his Id
    Product.findOneAndUpdate({_id: id}, updatedProduct, {new: true})
        //Bringing categories
        .populate('categories')
        .then(product => {
            //If Product true
            if(product) {
            res.json({result: true, product});
            } else {
            //No matching case
            res.json({result: false, error: 'Product not found'});
            }
        })
        .catch(error => {
            //Something wen't wrong
            res.json({result: false, error});
        });
  });

//////////////////////////
//Delete route for Product
router.delete('/deleteProduct/:id', (req, res) => {
//Const for parameter Id
const id = req.params.id;

//Delete a Product in fonction of Id
Product.findOneAndDelete({_id: id})
    //Bringing categories
    .populate('categories')
    .then(product => {
    if(product) {
        //Succes
        res.json({result: true, message: 'Product deleted successfully'});
    } else {
        //Product not found
        res.json({result: false, error: 'Product not found'});
    }
    })
    .catch(error => {
    //Something went wrong
    res.json({result: false, error});
    });
});

//////////////////////////
//GET All Products
router.get('/allProducts', (req, res) => {
    //GET All Products
    Product.find().then(data => {
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

////////////////////////////
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
    month.setDate(month.getDate() + 7);

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

module.exports = router;