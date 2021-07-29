const Category = require('../models/categoryModel')
const categoryCtrl = {
    getCategories: async(req,res) =>{
        // res.json('category')
        try{
            const categories = await Category.find()
            res.json(categories)

        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async(req,res) => {
        try{
            //only admin can create,delete & update
            //if user have role 1 ---> admin
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg: "This category exist"})

            const newCategory = new Category({name})

            await newCategory.save()
            res.json({msg: "created a category"})

        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async(req,res) => {
        try{
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Category"})

        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async(req,res) => {
        try{
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id: req.params.id}, {name})
            res.json({msg: "updated a category"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl