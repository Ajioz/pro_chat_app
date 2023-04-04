import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email : {
        type: String,
        required: [true, 'Please provide a valid email'],
        unique : true,
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        'Please provide valid email'
        ]
    },
    password : {
        type: String,
        required: [true, 'Please provide a valid password'],
        min: 3
    },
    isAvatarImageSet : {
        type: Boolean,
        default : false
    },
    avatarImage : {
        type: String,
        default: ""
    },
    online:{
        type: Boolean,
        default:false
    }
}, 
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password.trim(), 10);
})

userSchema.methods.matchPassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

export default mongoose.model('User', userSchema);