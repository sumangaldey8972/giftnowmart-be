const express = require("express")
const { commonErrors } = require("../errors/error")
const { getCategoryListController, createCategoryController, deleteCategoryController, editCategoryController } = require("../controller/category.controller")
const router = express.Router()

router.post('/', createCategoryController)

router.get('/', getCategoryListController)

router.post('/update', editCategoryController)

router.delete('/', deleteCategoryController)


router.use(commonErrors)

module.exports = router