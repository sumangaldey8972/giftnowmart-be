const { createBrandQuery, getBrandListQuery, deleteBrandQuery, editBrandQuery } = require("../query/brand.query")


const createBrandController = async (req, res, next) => {
    try {
        const response = await createBrandQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getBrandListController = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query
        const response = await getBrandListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)
    } catch (error) {
        next(error)
    }
}



const deleteBrandController = async (req, res, next) => {
    try {

        const response = await deleteBrandQuery(req.query.ids)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const editBrandController = async (req, res, next) => {
    try {
        const response = await editBrandQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createBrandController,
    getBrandListController,
    deleteBrandController,
    editBrandController
}