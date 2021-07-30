const Products = require('../models/productsModel')

//Filter, Sorting and pagination
class APIfeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }
    filtering(){
        const queryObj = {...this.queryString}
        // console.log({before: queryObj})       //Before delete page
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(e1 => delete(queryObj[e1]))
        // console.log({after: queryObj})       //After delete page
        
        let queryStr = JSON.stringify(queryObj)
        
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' +match)
        // console.log({queryStr})

        this.query.find(JSON.parse(queryStr))
        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            // console.log(sortBy)
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1 
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
const productCtrl = {
    getProducts : async(req,res) => {
        try{
            
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status: 'success',
                result:products.length,
                products: products
            })
        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    createProducts: async(req,res) => {
        try{
            const {product_id, title, price, description, content, images, category,sold} = req.body;
            if(!images) return res.status(400).json({msg: "No images Upload"})

            const product = await Products.findOne({product_id})
            if(product)
                return res.status(400).json({msg: "This product already exist"})

            const newProduct = new Products({
                product_id,title: title.toLowerCase(), price, description, content, images, category,sold
            })

            await newProduct.save()
            res.json({msg: "Created a Product"})

        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProducts: async(req,res) => {
        try{
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Products"})
        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateProducts: async(req,res) => {
        try{
            const {title, price, description, content, images, category}=req.body;
            if(!images) return res.status(400).json({msg:"No images upload"})

            await Products.findByIdAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category})

                res.json({msg: "Updated a Product"})
        }catch (err){
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productCtrl