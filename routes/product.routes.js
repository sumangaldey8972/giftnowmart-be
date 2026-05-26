const express = require("express")
const { commonErrors } = require("../errors/error")
const { getProductListController, createProductController, deleteProductController, getProductCountController, editProductController } = require("../controller/product.controller")
const router = express.Router()

router.post('/', createProductController)

router.get('/', getProductListController)

router.post('/update', editProductController)

router.delete('/', deleteProductController)

router.get("/get-product-count", getProductCountController)


router.use(commonErrors)

module.exports = router