const { getProductListQuery, createProductQuery, deleteProductQuery, getProductCountQuery, editProductQuery } = require("../query/product.query")


const createProductController = async (req, res, next) => {
    try {
        const response = await createProductQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getProductListController = async (req, res, next) => {
    try {

        const { page, limit, search } = req.query

        const response = await getProductListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const deleteProductController = async (req, res, next) => {
    try {

        const response = await deleteProductQuery(req.query.ids)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

const getProductCountController = async (req, res, next) => {
    try {
        const response = await getProductCountQuery()
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const editProductController = async (req, res, next) => {
    try {
        const response = await editProductQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getProductListController,
    createProductController,
    deleteProductController,
    getProductCountController,
    editProductController
}