import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import productModel from "../../../DB/model/product.model.js";
import cloudinary from "../../utls/cloudinary.js";
import { pagination } from "../../utls/pagination.js";

export const create = async (req, res) => {
    try {
        const { name, price, discount, categoryId, subcategoryId } = req.body;
        
        const checkCategory = await categoryModel.findById(categoryId);
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const checkSubCategory = await subCategoryModel.findOne({ _id: subcategoryId, categoryId });
        if (!checkSubCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        req.body.slug = slugify(name);
        req.body.finalPrice = price - ((price * (discount || 0)) / 100);

        if (!req.files || !req.files.mainImage || !req.files.mainImage[0]) {
            return res.status(400).json({ message: "Main image is required" });
        }

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `talaShop/product/${name}` });

        req.body.mainImage = { secure_url, public_id };

        req.body.subImage = [];
        if (req.files.subImage) {
            for (const file of req.files.subImage) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `talaShop/product/${name}/subImages` });
                req.body.subImage.push({ secure_url, public_id });
            }
        }

        const product = await productModel.create(req.body);
        return res.status(201).json({ message: "success", product });

    } catch (error) {
        console.error("Error in create product:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getProduct = async (req, res) => {

    const { skip, limit } = pagination(req.query.page, req.query.limit)

    let queryObj = { ...req.query }

    const execQuery = ['page', 'limit', 'sort', 'fields']

    execQuery.map((ele) => {
        delete queryObj[ele];
    })

    queryObj = JSON.stringify(queryObj)

    queryObj = queryObj.replace(/gt|gte|lt|lte|eq|in|nin/g, match => `$${match}`)

    queryObj = JSON.parse(queryObj)

    const mongoseQuery = await productModel.find(queryObj).skip(skip).limit(limit)
    // .populate({
    //     path: 'reviews',
    //     populate: {
    //         path: 'userId',
    //         select: 'userName - _id'
    //     }
    // })

    if (req.query.search) {
        mongoseQuery.find({
            $or: [
                { name: { $regex: req.query.search } },
                { description: { $regex: req.query.search } }
            ]
        })
    }

    const count = await productModel.estimatedDocumentCount()

    mongoseQuery.select(req.query.fields)

    let products = await mongoseQuery.sort(req.query.sort)

    products = products.map(product =>{
        return{
            ...product.toObject(),
            mainImage: product.mainImage.secure_url,
            subImages:product.subImages.map(img=>img.secure_url),
        }
    })

    return res.status(200).json({ message: "success", count, products });
}