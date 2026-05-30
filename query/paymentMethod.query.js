
const { default: paymentMethodModel } = require("../models/paymentMethod.model");

const createPaymentMethodQuery = async (details) => {
    try {

        const {
            key,
            title,
            type,
            cryptoConfig,
        } = details;

        /**
         * REQUIRED VALIDATIONS
         */

        if (!key || !key.trim()) {
            return {
                status: false,
                statusCode: 400,
                message: "Payment method key is required"
            };
        }

        if (!title || !title.trim()) {
            return {
                status: false,
                statusCode: 400,
                message: "Payment method title is required"
            };
        }

        if (!type || !["crypto", "wallet", "bank"].includes(type)) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid payment method type"
            };
        }

        /**
         * DUPLICATE KEY CHECK
         */

        const existingPaymentMethod =
            await paymentMethodModel.findOne({
                key: key.toLowerCase().trim()
            });

        if (existingPaymentMethod) {
            return {
                status: false,
                statusCode: 409,
                message: "Payment method key already exists"
            };
        }

        /**
         * CRYPTO VALIDATIONS
         */

        if (type === "crypto") {

            if (
                !cryptoConfig ||
                !cryptoConfig.currency ||
                !cryptoConfig.network ||
                !cryptoConfig.walletAddress
            ) {
                return {
                    status: false,
                    statusCode: 400,
                    message:
                        "Currency, network and wallet address are required for crypto payment methods"
                };
            }
        }

        /**
         * CREATE PAYMENT METHOD
         */

        const newPaymentMethod =
            await paymentMethodModel.create({
                ...details,

                key: key.toLowerCase().trim(),

                title: title.trim(),
            });

        return {
            status: true,
            statusCode: 201,
            message: "New payment method added successfully",
            newPaymentMethod
        };

    } catch (error) {

        console.log(error);

        return {
            status: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        };
    }
};

const getPaymentMethodListQuery = async ({ page = 1, limit = 10, search }) => {
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

        const aggregate = paymentMethodModel.aggregate([

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
            }

        ]);

        const options = {
            page,
            limit
        };

        const paymentMethods = await paymentMethodModel.aggregatePaginate(
            aggregate,
            options
        );

        return {
            status: true,
            statusCode: 200,
            paymentMethods
        };

    } catch (error) {

        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const editPaymentMethodQuery = async (details) => {
    try {
        const { _id, title, type, cryptoConfig, } = details;
        /** * REQUIRED VALIDATION */
        if (!_id) {
            return {
                status: false,
                statusCode: 400,
                message: "Payment method id is required"
            };
        }


        /** * FIND EXISTING PAYMENT METHOD */
        const existingPaymentMethod = await paymentMethodModel.findById(_id);
        if (!existingPaymentMethod) {
            return {
                status: false,
                statusCode: 404,
                message: "Payment method not found"
            };
        }


        /** * TITLE VALIDATION */
        if (title !== undefined && !title.trim()) {
            return {
                status: false,
                statusCode: 400,
                message: "Title cannot be empty"
            };
        }


        /** * TYPE VALIDATION */
        if (type && !["crypto", "wallet", "bank"].includes(type)) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid payment method type"
            };
        }


        /** * CRYPTO VALIDATION */
        const finalType = type || existingPaymentMethod.type;
        if (finalType === "crypto") {
            const finalCryptoConfig = {
                ...existingPaymentMethod.cryptoConfig?.toObject?.(),
                ...cryptoConfig,
            };
            if (!finalCryptoConfig.currency || !finalCryptoConfig.network || !finalCryptoConfig.walletAddress) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Currency, network and wallet address are required for crypto payment methods"
                };
            }
        }

        /** * UPDATE PAYMENT METHOD */
        const updatedPaymentMethod = await paymentMethodModel.findByIdAndUpdate(_id,
            {
                $set:
                {
                    ...details,
                    ...(title && { title: title.trim() }),
                }
            },
            {
                new: true, runValidators: true,
            });


        return {
            status: true,
            statusCode: 200,
            message: "Payment method updated successfully",
            updatedPaymentMethod
        };


    } catch (error) {
        console.log(error);
        return {
            status: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        };
    }
};

const deletePaymentMethodQuery = async (ids) => {
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
        const result = await paymentMethodModel.deleteMany({ _id: { $in: ids } });


        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} payment method(s) deleted successfully`,
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


module.exports = {
    createPaymentMethodQuery,
    getPaymentMethodListQuery,
    editPaymentMethodQuery,
    deletePaymentMethodQuery
};
