import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";

// export const create = async(req, res) => {
//     const name = req.body.name .toLowerCase();
//     if(await categoryModel.findOne({name})){
//         return res.status(409).json({message:"Category already exists"})
//     }

//     const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
//         folder : 'talaShop/categories'
//     })

//     const slug = slugify(name)

//     return res.json({ message: "success", slug});

// }

export const create = async (req, res) => {
    req.body.name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name: req.body.name })) {
        return res.status(409).json({ message: "category already exists" });
    }

    req.body.slug = slugify(req.body.name);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'talaShop/categories'
    });

    req.body.image = { secure_url, public_id };

    const category = await categoryModel.create(req.body);

    return res.json({ message: category });
}
