const { default: brandModel } = require("../models/brand.model");

const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
};

const createBrandQuery = async (details) => {
    try {

        const {
            brandId,
            name,
            logo = null,
            isFeatured = false,
            isActive = true,
            createdBy
        } = details;

        const slug = slugify(name);

        const exist = await brandModel.findOne({ slug });

        if (exist) {
            return {
                status: false,
                statusCode: 400,
                message: "Brand already exists"
            };
        }

        const brand = await brandModel.create({
            brandId,
            name,
            slug,
            logo,
            isFeatured,
            isActive,
            createdBy
        });

        return {
            status: true,
            statusCode: 201,
            message: "New Brand added",
            brand
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const getBrandListQuery = async ({ page = 1, limit = 10, search }) => {
    try {

        let matchQuery = {};

        if (search && search.trim()) {
            matchQuery.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const aggregate = brandModel.aggregate([

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

            // Optimized Product Count
            {
                $lookup: {
                    from: "products",
                    let: { categoryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$categoryId", "$$categoryId"]
                                }
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    as: "productData"
                }
            },

            {
                $addFields: {
                    productCount: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    "$productData.count",
                                    0
                                ]
                            },
                            0
                        ]
                    }
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
            }

        ]);

        const options = {
            page,
            limit
        };

        const brands = await brandModel.aggregatePaginate(
            aggregate,
            options
        );

        return {
            status: true,
            statusCode: 200,
            brands
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


const deleteBrandQuery = async (ids) => {
    try {
        console.log({ ids })
        ids = JSON.parse(ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of brand id"
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
        const result = await brandModel.deleteMany({ _id: { $in: ids } });


        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} brand(s) deleted successfully`,
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


const editBrandQuery = async (details) => {
    try {

        const updateData = {
            name: details.name,
            slug: slugify(details.name),
            isActive: details.isActive,
            isFeatured: details.isFeatured
        };

        const brand = await brandModel.findByIdAndUpdate(
            details._id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!brand) {
            return {
                status: false,
                statusCode: 404,
                message: "Brand not found"
            };
        }

        return {
            status: true,
            statusCode: 200,
            message: "Brand updated",
            brand
        };

    } catch (error) {
        console.log(error);

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


module.exports = {
    createBrandQuery,
    getBrandListQuery,
    deleteBrandQuery,
    editBrandQuery
};