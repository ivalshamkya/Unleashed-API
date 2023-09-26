import categoryService from "../service/category-service.js";

const getAllCategory = async (req, res, next) => {
    try {
       const result = await categoryService.getAllCategory(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

export default {
    getAllCategory
}