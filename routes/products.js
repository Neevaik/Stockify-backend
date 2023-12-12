var express = require('express');
var router = express.Router();

//Require Product from Models
const Product = require('../models/products')

//////////////////////
//Creation new Product
router.post('/newProduct', (req, res)=> {
    // Check if name is provided
    if (!req.body.name) {
      return res.json({result: false, error: 'Name is required'});
    }
  
    Product.findOne({name: req.body.name})
    //Bringing categories
    .populate('category')
    .then(data => {
      
      //Checking if product already exists
      if(data === null) {
          //If not existing = Creation
          const newProduct = new Product({
                name: req.body.name,
                image: req.body.image,
                // default to 0 if not provided
                stock: req.body.stock || 0,
                // default to empty array if not provided
                soldAt: req.body.soldAt ? JSON.parse(req.body.soldAt) : [],
                // default to empty array if not provided
                restockAt: req.body.restockAt ? JSON.parse(req.body.restockAt) : [], 
                category: req.body.category,
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

////////////////////////////////
//  Modification new Product  //
////////////////////////////////
// Route de base à conserver  //
// Pour toute modifi Admin    //
////////////////////////////////
router.put('/updateProduct/:name', (req, res) => {
    const name = req.params.name;
    const updatedProduct = {
      name: name,
      image: req.body.image,
      //stock: req.body.stock,
      //soldAt: JSON.parse(req.body.soldAt),
      //restockAt: JSON.parse(req.body.restockAt),
      categories: req.body.categories,
    };
    Product.findOneAndUpdate({name: name}, updatedProduct)
        .then(() => {
            Product.findOne({name: name})
                .populate('categories')
                .then(product => {
                    if(product) {
                        res.json({result: true, product});
                    } else {
                        res.json({result: false, error: 'Product not found'});
                    }
                })
                .catch(error => {
                    if (error.path === 'categories') {
                        // Si une erreur de peuplement se produit, renvoyez le document non peuplé
                        Product.findOne({name: name})
                            .then(product => {
                                if(product) {
                                    res.json({result: true, product});
                                } else {
                                    res.json({result: false, error: 'Product not found'});
                                }
                            })
                    } else {
                        res.json({result: false, error});
                    }
                });
        })
        .catch(error => {
            res.json({result: false, error});
        });
});


//////////////////////////
// Update Stock Only
router.put('/updateStockProduct/:name', (req, res) => {
    const name = req.params.name;
    const updatedProduct = {
      // name: req.body.name, // Name is in comment because it shoun't be able to get a mod'
      //image: req.body.image,
      stock: req.body.stock,
      //soldAt: JSON.parse(req.body.soldAt),
      //restockAt: JSON.parse(req.body.restockAt),
      //categories: req.body.categories,
    };
    Product.findOneAndUpdate({name: name}, updatedProduct)
        .then(() => {
            Product.findOne({name: name})
                .populate('categories')
                .then(product => {
                    if(product) {
                        res.json({result: true, product});
                    } else {
                        res.json({result: false, error: 'Product not found'});
                    }
                })
                .catch(error => {
                    if (error.path === 'categories') {
                        // Si une erreur de peuplement se produit, renvoyez le document non peuplé
                        Product.findOne({name: name})
                            .then(product => {
                                if(product) {
                                    res.json({result: true, product});
                                } else {
                                    res.json({result: false, error: 'Product not found'});
                                }
                            })
                    } else {
                        res.json({result: false, error});
                    }
                });
        })
        .catch(error => {
            res.json({result: false, error});
        });
});

//////////////////////////
//Update soldAt Only
router.put('/updateSoldAtProduct/:name', (req, res) => {
    const name = req.params.name;
    const updatedProduct = {
      // name: req.body.name, // Name is in comment because it shoun't be able to get a mod'
      //image: req.body.image,
      //stock: req.body.stock,
      soldAt: JSON.parse(req.body.soldAt),
      //restockAt: JSON.parse(req.body.restockAt),
      //categories: req.body.categories,
    };
    Product.findOneAndUpdate({name: name}, updatedProduct)
        .then(() => {
            Product.findOne({name: name})
                .populate('categories')
                .then(product => {
                    if(product) {
                        res.json({result: true, product});
                    } else {
                        res.json({result: false, error: 'Product not found'});
                    }
                })
                .catch(error => {
                    if (error.path === 'categories') {
                        // Si une erreur de peuplement se produit, renvoyez le document non peuplé
                        Product.findOne({name: name})
                            .then(product => {
                                if(product) {
                                    res.json({result: true, product});
                                } else {
                                    res.json({result: false, error: 'Product not found'});
                                }
                            })
                    } else {
                        res.json({result: false, error});
                    }
                });
        })
        .catch(error => {
            res.json({result: false, error});
        });
});

//////////////////////////
//Update restockAt Only
router.put('/updateRestockAtProduct/:name', (req, res) => {
    const name = req.params.name;
    const updatedProduct = {
      // name: req.body.name, // Name is in comment because it shoun't be able to get a mod'
      //image: req.body.image,
      //stock: req.body.stock,
      //soldAt: JSON.parse(req.body.soldAt),
      restockAt: JSON.parse(req.body.restockAt),
      //categories: req.body.categories,
    };
    Product.findOneAndUpdate({name: name}, updatedProduct)
        .then(() => {
            Product.findOne({name: name})
                .populate('categories')
                .then(product => {
                    if(product) {
                        res.json({result: true, product});
                    } else {
                        res.json({result: false, error: 'Product not found'});
                    }
                })
                .catch(error => {
                    if (error.path === 'categories') {
                        // Si une erreur de peuplement se produit, renvoyez le document non peuplé
                        Product.findOne({name: name})
                            .then(product => {
                                if(product) {
                                    res.json({result: true, product});
                                } else {
                                    res.json({result: false, error: 'Product not found'});
                                }
                            })
                    } else {
                        res.json({result: false, error});
                    }
                });
        })
        .catch(error => {
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