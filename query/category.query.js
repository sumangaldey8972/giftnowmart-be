const { default: categoryModel } = require("../models/category.model")


const createCategoryQuery = async (details) => {
    try {
        console.log(details)
        const { catId, name, slug, isActive, createdBy } = details

        const exist = await categoryModel.findOne({ slug });

        if (exist) {
            return {
                status: false,
                statusCode: 400,
                message: "Category already exist"
            }
        }

        const category = await categoryModel.create({
            name: name,
            catId: catId,
            slug: slug,
            isActive: isActive,
            createdBy: createdBy
        })

        return {
            status: true,
            statusCode: 201,
            message: "New Category added",
            category
        }


    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


const getCategoryListQuery = async ({ page = 1, limit = 10, search }) => {
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

        const aggregate = categoryModel.aggregate([

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

        const categories = await categoryModel.aggregatePaginate(
            aggregate,
            options
        );

        return {
            status: true,
            statusCode: 200,
            categories
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const deleteCategoryQuery = async (ids) => {
    try {
        console.log({ ids })
        ids = JSON.parse(ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of category id"
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
        const result = await categoryModel.deleteMany({ _id: { $in: ids } });


        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} category(s) deleted successfully`,
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


const editCategoryQuery = async (details) => {
    try {

        const updateData = {
            name: details.name,
            slug: details.slug,
            isActive: details.isActive
        };

        const category = await categoryModel.findByIdAndUpdate(
            details._id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return {
                status: false,
                statusCode: 404,
                message: "Category not found"
            };
        }

        return {
            status: true,
            statusCode: 200,
            message: "Category updated",
            category
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
    createCategoryQuery,
    getCategoryListQuery,
    deleteCategoryQuery,
    editCategoryQuery
}