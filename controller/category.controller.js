const { getCategoryListQuery, createCategoryQuery, deleteCategoryQuery, editCategoryQuery } = require("../query/category.query")

const createCategoryController = async (req, res, next) => {
    try {
        const category = await createCategoryQuery(req.body)
        return res.send(category)
    } catch (error) {
        next(error)
    }
}

const getCategoryListController = async (req, res, next) => {
    try {

        const { page, limit, search } = req.query

        const response = await getCategoryListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}



const deleteCategoryController = async (req, res, next) => {
    try {

        const response = await deleteCategoryQuery(req.query.ids)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

const editCategoryController = async (req, res, next) => {
    try {
        const response = await editCategoryQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createCategoryController,
    getCategoryListController,
    deleteCategoryController,
    editCategoryController
}