const { createPaymentMethodQuery, getPaymentMethodListQuery, editPaymentMethodQuery, deletePaymentMethodQuery } = require("../query/paymentMethod.query")


const createPaymentMethodController = async (req, res, next) => {
    try {
        const response = await createPaymentMethodQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getPaymentMethodListController = async (req, res, next) => {
    try {

        const { page, limit, search } = req.query

        const response = await getPaymentMethodListQuery({ page: Number(page) || 1, limit: Number(limit) || 10, search: search || "" })
        return res.send(response)

    } catch (error) {
        next(error)
    }
}


const editPaymentMethodController = async (req, res, next) => {
    try {
        const response = await editPaymentMethodQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const deletePaymentMethodController = async (req, res, next) => {
    try {
        const response = await deletePaymentMethodQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createPaymentMethodController,
    getPaymentMethodListController,
    editPaymentMethodController,
    deletePaymentMethodController
}