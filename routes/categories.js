const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const Category = require ('../models/categories')
//Use for suppression of the category in the product "scope"
const Product = require('../models/products'); 

///////////////////////
//Creation new Category
router.post('/newCategory', (req, res)=> {
    Category.findOne({name: req.body.name})
    .then(data => {
      
      //Checking if Category already exists
      if(data === null) {
          //If not existing = Creation
          const newCategory = new Category({
              name: req.body.name,
              image: req.body.image,
          })
          // Saving of the Category
          newCategory.save().then(newCategory => {
              res.json({result: true, newCategory})
          })
      }else{
          //Category already exists
          res.json({result: false, error: 'Category already exists'})
      }
    })
  });

////////////////////////////////////////////////
//Modification of the Category in fonction of Id
router.put('/updateCategory/:name', (req, res) => {
    //Const for paramèter Id
    const name = req.params.name;
    //Update Category's fields
    const updatedCategory = {
      name: req.body.name,
      image: req.body.image,
    }; 
    //Research for Category with his Id
    Category.findOneAndUpdate({name: name}, updatedCategory, {new: true})
        .then(category => {
            //If Category true
            if(category) {
            res.json({result: true, category});
            } else {
            //No matching case
            res.json({result: false, error: 'Category not found'});
            }
        })
        .catch(error => {
            //Something wen't wrong
            res.json({result: false, error});
        });
  });

//////////////////////////////
//Delete route for Category
router.delete('/deleteCategory/:name', async (req, res) => {
    const name = req.params.name;

    try {
        // Find the category first by name
        const category = await Category.findOne({ name: name });
        if(category) {
            // Update products with the foreign key
            const result = await Product.updateMany(
                { category: category._id }, // find products with the category id
                { $pull: { category: category._id } } // remove the category id from the array
            );

            if (result) {
                // Delete the category after updating the products
                await Category.findByIdAndDelete(category._id);
                res.json({result: true, message: 'Category and related products updated successfully'});
            } else {
                res.json({result: false, error: 'Failed to update products'});
            }
        } else {
            res.json({result: false, error: 'Category not found'});
        }
    } catch (error) {
        res.json({result: false, error});
    }
});


//////////////////////////////
//GET All Category
router.get('/allCategories', (req, res) => {
    Category.find().then(data => {
        if (data.length > 0) {
            res.json({ result: true, allCategories: data });
        } else {
            res.json({ result: false, error: 'No categories found' });
        }
    });
});

//////////////////////////////
//GET By ID route for Category
router.get('/', (req, res) => {
    //Const for parameter Id
    const name = req.params.name;

    Category.findOne({ name: name }).then(data => {
        if (data) {
        res.json({ result: true, allCategory :[] });
        } else {
        res.json({ result: false, error: 'Category not found' });
        }
    });
});

module.exports = router;