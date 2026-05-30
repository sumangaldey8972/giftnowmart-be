const express = require("express")
const { commonErrors } = require("../errors/error")
const { getProductListController, createProductController, deleteProductController, getProductCountController, editProductController } = require("../controller/product.controller")
const { createPaymentMethodController, getPaymentMethodListController, editPaymentMethodController, deletePaymentMethodController } = require("../controller/paymentMethod.controller")
const router = express.Router()

router.post('/', createPaymentMethodController)

router.get('/', getPaymentMethodListController)

router.post('/update', editPaymentMethodController)

router.delete('/', deletePaymentMethodController)

router.get("/get-product-count", getProductCountController)


router.use(commonErrors)

module.exports = router