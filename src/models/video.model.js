import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary url
        required: true
    },
    thumbnail: {
        type: String, //cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

//If you have thousands of video documents and you want to show them in pages of 10 per page, this plugin helps by returning only the required data for each page, along with additional info like the total number of pages, next page, etc: ChatGPT
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)   