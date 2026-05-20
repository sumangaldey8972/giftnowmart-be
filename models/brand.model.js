import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2"


const brandSchema = new mongoose.Schema(
    {
        brandId: {
            type: String,
            unique: true
        },

        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true
        },

        logo: String,

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

brandSchema.plugin(aggregatePaginate)
brandSchema.plugin(mongoosePaginate)

export default mongoose.model("Brand", brandSchema);