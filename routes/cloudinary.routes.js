// routes/cloudinary.routes.js
const express = require("express");
const { generateSignatureForBrandLogo } = require("../controller/cloudionary.controller");
const router = express.Router();



router.post("/brand-logo", generateSignatureForBrandLogo);


module.exports = router;
