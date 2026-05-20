const express = require("express")
const { commonErrors } = require("../errors/error")
const { createBrandController, getBrandListController, deleteBrandController, editBrandController } = require("../controller/brand.controller")
const router = express.Router()

router.post('/', createBrandController)

router.get('/', getBrandListController)

router.post('/update', editBrandController)

router.delete('/', deleteBrandController)


router.use(commonErrors)

module.exports = router