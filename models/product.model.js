import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2"


const priceVariantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        cardValue: {
            type: Number,
            required: true
        },

        discountPercentage: {
            type: Number,
            default: 0
        },

        sellingPrice: {
            type: Number,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        _id: true
    }
);

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            unique: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            index: true
        },

        shortDescription: String,

        description: String,

        logo: String,

        bannerImage: String,

        // Category
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        // Brand
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },

        // Price Variants
        priceVariants: [priceVariantSchema],

        currency: {
            type: String,
            default: "USD"
        },

        deliveryType: {
            type: String,
            enum: ["physical", "virtual"],
            default: "virtual"
        },

        redeemSteps: String,

        validity: String,

        termsAndConditions: String,

        isFeatured: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

productSchema.plugin(aggregatePaginate)
productSchema.plugin(mongoosePaginate)

export default mongoose.model("Product", productSchema);