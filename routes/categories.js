//#region imports
const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const Category = require ('../models/categories')
const Product = require('../models/products'); 

//#endregion


//#region POST method


router.post('/newCategory', async (req, res) => {
    const { name, image } = req.body;

    try {
        const existingCategory = await Category.findOne({ name })

        if (existingCategory) {
            return res.json({ result: false, error: 'Category already exist' });
        }

        const newCategory = new Category({
            name,
            image,
        });

        const savedCategory = await newCategory.save();
        res.json({ result: true, newCategory: savedCategory })

    }
    catch (error) {
        res.status(500).json({ result: false, error: 'Failed to create new category' });
    }

})

//#endregion

//#region PUT methods


router.put('/updateCategory/:name', async (req, res) => {
    const name = req.params.name;
    const { newName, image } = req.body;

    const updateCategory = {
        name: newName,
        image,
    }
    try {
        const category = await Category.findOneAndUpdate({ name }, updateCategory, { new: true })

        if (category) {
            return res.json({ result: true, category });
        } else {
            return res.json({ result: false, error: 'Category not found' });
        }
    }
    catch (error) {
        res.status(500).json({ result: false, error: 'Failed to update category' });
    }
})

//#endregion 

//#region DELETE method

router.delete('/deleteMyCategory/:name', async (req, res) => {
    try {
      const deletionResult = await Category.deleteOne({ name: req.params.name });
      
      if (deletionResult.deletedCount === 1) {
        return res.json({ result: true, message: 'Category deleted successfully' });
      } else {
        return res.json({ result: false, error: 'Category not found or already deleted' });
      }
  
    } catch (error) {
      res.status(500).json({ result: false, error: 'Failed to delete category' });
    }
  });
  


//#endregion

//#region GET method 

router.get('/allCategories', async (req, res) => {
    try {
        const categories = await Category.find();

        if (categories.length > 0) {
            return res.json({ result: true, allCategories: categories });
        } else {
            return res.json({ result: false, error: 'No categories found' });
        }

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ result: false, error: 'Failed to fetch categories' });
    }
});

router.get('/getId/:name', async (req, res) => {
    try {
      const category = await Category.findOne({ name: req.params.name });
  
      if (category) {
        return res.json({ result: true, categoryId: category._id });
      } else {
        return res.json({ result: false, error: 'Category not found' });
      }
  
    } catch (error) {
      console.error('Error fetching category ID:', error);
      res.status(500).json({ result: false, error: 'Failed to fetch category ID' });
    }
  });

//#endregion



module.exports = router;