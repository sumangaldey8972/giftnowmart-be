import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2"


const paymentMethodSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        subtitle: {
            type: String,
            default: "",
        },

        type: {
            type: String,
            enum: [
                "crypto",
                "wallet",
                "bank",
            ],
            required: true,
        },

        icon: {
            type: String,
            default: "",
        },

        enabled: {
            type: Boolean,
            default: true,
        },

        comingSoon: {
            type: Boolean,
            default: false,
        },

        processingFee: {
            type: Number,
            default: 0,
        },

        sortOrder: {
            type: Number,
            default: 0,
        },

        supportedCurrencies: [
            {
                type: String,
            },
        ],

        // ONLY FOR CRYPTO
        cryptoConfig: {

            currency: {
                type: String,
                default: "",
            },

            network: {
                type: String,
                default: "",
            },

            walletAddress: {
                type: String,
                default: "",
            },

            qrCode: {
                type: String,
                default: "",
            },
        },

        instructions: {
            type: String,
            default: "",
        },

        verificationType: {
            type: String,
            enum: [
                "manual",
                "automatic",
            ],
            default: "manual",
        },

        metadata: {
            type: Object,
            default: {},
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

paymentMethodSchema.plugin(aggregatePaginate)
paymentMethodSchema.plugin(mongoosePaginate)

export default mongoose.model("PaymentMethod", paymentMethodSchema)