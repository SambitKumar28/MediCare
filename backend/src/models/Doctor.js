import mongoose from "mongoose";

const weeklyAvailabilitySchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
            enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        slots: {
            type: [String],
            default: []
        }
    },
    { _id: false }
);

const doctorSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        specialization:{
            type:String,
            required:true,
            trim:true
        },
        experience:{
            type:Number,
            required:true
        },
        fees:{
            type:Number,
            required:true 
        },
        degree:{
            type:String,
            trim:true,
            default:""
        },
        bio:{
            type:String,
            trim:true,
            default:""
        },
        clinicAddress:{
            type:String,
            trim:true,
            default:""
        },
        photoUrl:{
            type:String,
            trim:true,
            default:""
        },
        languages:{
            type:[String],
            default:[]
        },
        consultationMode:{
            type:String,
            enum:["clinic", "online", "both"],
            default:"clinic"
        },
        availability:{
            type: [String],
            default: []
        },
        weeklyAvailability:{
            type:[weeklyAvailabilitySchema],
            default:[]
        },
        approved:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
) 

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
