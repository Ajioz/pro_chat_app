import mongoose from 'mongoose'


const IsOnline = mongoose.Schema({
    online:{
        type: Boolean,
        default:false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    }, 
    {
        timestamps: true
    }
)
export default mongoose.model('Online', IsOnline);