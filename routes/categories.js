var express = require('express');
var router = express.Router();

const Category = require ('../models/categories')

//////////////////////
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

///////////////////////////////////////////////
//Modification of the Category in fonction of Id
router.put('/updateCategory/:id', (req, res) => {
    //Const for paramèter Id
    const id = req.params.id;
    //Update Category's fields
    const updatedCategory = {
      name: req.body.name,
      image: req.body.image,
    }; 
    //Research for Category with his Id
    Category.findOneAndUpdate({_id: id}, updatedCategory, {new: true})
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

//////////////////////////
//Delete route for Category
router.delete('/deleteCategory/:id', (req, res) => {
    //Const for parameter Id
    const id = req.params.id;
    
    //Delete a Category in fonction of Id
    Category.findOneAndDelete({_id: id})
        .then(category => {
        if(category) {
            //Succes
            res.json({result: true, message: 'Category deleted successfully'});
        } else {
            //Category not found
            res.json({result: false, error: 'Category not found'});
        }
        })
        .catch(error => {
        //Something went wrong
        res.json({result: false, error});
        });
    });

//////////////////////////
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

//////////////////////////
//GET By ID route for Category
router.get('/', (req, res) => {
    //Const for parameter Id
    const id = req.params.id;

    Category.findOne({ _id: id }).then(data => {
        if (data) {
        res.json({ result: true, allCategory :[] });
        } else {
        res.json({ result: false, error: 'Category not found' });
        }
    });
});

module.exports = router;