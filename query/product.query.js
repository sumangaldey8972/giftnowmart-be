const { default: productModel } = require("../models/product.model")
const { slugify } = require("./brand.query")


const createProductQuery = async (details) => {
    try {

        const {
            productId,
            title,
            shortDescription,
            description,
            logo = null,
            categoryId,
            brandId,
            priceVariants,
            currency = "USD",
            deliveryType = "manual",
            redeemSteps,
            validity,
            termsAndConditions,
            isFeatured = false,
            isActive = true,
            createdBy
        } = details;

        const slug = slugify(title);

        const exist = await productModel.findOne({ slug });

        if (exist) {
            return {
                status: false,
                statusCode: 400,
                message: "Product already exists"
            };
        }

        const product = await productModel.create({
            productId,
            title,
            slug,
            shortDescription,
            description,
            logo,
            categoryId,
            brandId,
            priceVariants,
            currency,
            deliveryType,
            redeemSteps,
            validity,
            termsAndConditions,
            isFeatured,
            isActive,
            createdBy
        });

        return {
            status: true,
            statusCode: 201,
            message: "New Product added",
            product
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const getProductListQuery = async ({ page = 1, limit = 10, search }) => {
    try {

        let matchQuery = {};

        if (search && search.trim()) {
            matchQuery.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const aggregate = productModel.aggregate([

            {
                $match: matchQuery
            },

            // Populate createdBy
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },

            {
                $unwind: {
                    path: "$createdBy",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    productData: 0,
                    "createdBy.password": 0
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            },

            // Populate category
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryId"
                }
            },

            {
                $unwind: {
                    path: "$categoryId",
                    preserveNullAndEmptyArrays: true
                }
            },


            // Populate brand
            {
                $lookup: {
                    from: "brands",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brandId"
                }
            },

            {
                $unwind: {
                    path: "$brandId",
                    preserveNullAndEmptyArrays: true
                }
            },

        ]);

        const options = {
            page,
            limit
        };

        const products = await productModel.aggregatePaginate(
            aggregate,
            options
        );

        return {
            status: true,
            statusCode: 200,
            products
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const deleteProductQuery = async (ids) => {
    try {
        ids = JSON.parse(ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of product id"
            };
        }

        // Validate MongoDB ObjectIds
        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDB ObjectId(s)",
                inValidIds
            };
        }

        // STEP 2: Delete category
        const result = await productModel.deleteMany({ _id: { $in: ids } });


        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} product(s) deleted successfully`,
            deletedCount: result.deletedCount,
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
}


const getProductCountQuery = async () => {
    try {
        const productCount = await productModel.countDocuments()

        return {
            status: true,
            statusCode: 200,
            message: "Product count fetched successfully!",
            productCount
        }
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const editProductQuery = async (details) => {
    try {

        const {
            _id,
            productId,
            title,
            shortDescription,
            description,
            logo,
            categoryId,
            brandId,
            priceVariants,
            currency,
            deliveryType,
            redeemSteps,
            validity,
            termsAndConditions,
            isFeatured,
            isActive,
        } = details;

        // Check Product Exist
        const existingProduct = await productModel.findOne({
            _id
        });

        if (!existingProduct) {
            return {
                status: false,
                statusCode: 404,
                message: "Product not found"
            };
        }

        // Generate New Slug
        const slug = slugify(title);

        // Check Duplicate Slug
        const duplicateProduct = await productModel.findOne({
            slug,
            _id: { $ne: existingProduct._id }
        });

        if (duplicateProduct) {
            return {
                status: false,
                statusCode: 400,
                message: "Product with same title already exists"
            };
        }

        // Update Product
        const updatedProduct = await productModel.findByIdAndUpdate(
            existingProduct._id,
            {
                title,
                slug,
                shortDescription,
                description,
                logo,
                categoryId,
                brandId,
                priceVariants,
                currency,
                deliveryType,
                redeemSteps,
                validity,
                termsAndConditions,
                isFeatured,
                isActive,
            },
            {
                new: true,
                runValidators: true
            }
        );

        return {
            status: true,
            statusCode: 200,
            message: "Product updated successfully",
            product: updatedProduct
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};
module.exports = {
    getProductListQuery,
    createProductQuery,
    deleteProductQuery,
    getProductCountQuery,
    editProductQuery
}