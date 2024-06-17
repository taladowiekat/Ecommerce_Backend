import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import productModel from "../../../DB/model/product.model.js";
import cloudinary from "../../utls/cloudinary.js";

export const create = async (req, res) => {
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
};
