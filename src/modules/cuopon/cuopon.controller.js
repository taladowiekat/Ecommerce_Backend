
import categoryModel from "../../../DB/model/category.model.js";
import cuoponModel from "../../../DB/model/cuopon.model.js";

export const create = async (req, res) => {
    if(await cuoponModel.findOne({name:req.body.name})){
        return res.status(409).json({message:"cuopon name already exists"});
    }

    req.body.expireDate = new Date(req.body.expireDate);

    const cuopon = await cuoponModel.create(req.body);

    return res.status(200).json({message:"success", cuopon});
}
