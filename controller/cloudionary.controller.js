// controllers/cloudinary.controller.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateSignatureForBrandLogo = async (req, res) => {
    try {
        const { brandId, folderName } = req.body;

        if (!brandId) {
            return res.status(400).json({ error: "brandId is required" });
        }

        const timestamp = Math.round(Date.now() / 1000);

        const folder = folderName || "brand_logo";
        const public_id = brandId; // ONE IMAGE PER PUBLISHER

        const paramsToSign = {
            timestamp,
            folder,
            public_id,
            overwrite: true,
            invalidate: true,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            folder,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            public_id,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate signature" });
    }
};


module.exports = {
    generateSignatureForBrandLogo,
};
