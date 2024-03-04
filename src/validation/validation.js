import categoryModel from "../../db/models/categoryModel.js";

export const validateCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findOne({ name: req.body.category });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        req.body.categoryId = category._id;
        next();
    } catch (error) {
        console.error("Error validating category:", error);
        res.status(500).json({ message: "An error occurred while validating the category" });
    }
};



export const validation = (Schema)=>{
    return (req , res , next) => {
        let check = Schema.validate(req.body,{abortEarly:false});
        if(check && check.error){
            res.json({message:"validation error",error:check.error})
        }else{
            next()
        }
    }
} 

