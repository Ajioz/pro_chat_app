import onlineModel from "../model/onlineModel.js";
import User from "../model/userModel.js"; 




// Register User
export const register = async(req, res, next) => {
    const {username, email, password} = req.body;
    try {
        let findUsername = await User.findOne({ username });
        let findEmail = await User.findOne({ email });
        if ( findUsername ) return res.json({ msg: "Username already taken", status: false });
        if ( findEmail ) return res.json({ msg: "Email already taken", status: false });
        let user = await User.create({email, username, password});
        let user_status = await onlineModel.create({ online:true, user: user._id } )
        delete user.password;
        return res.status(201).json({status: true, user, isOnline: user_status})   
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error});
        return res.status(500).json({ status: false, msg: "Failed to create user"})
    }
}


// User Login
export const login = async(req, res, next) => {
    const {username, password} = req.body;
    try {
        let user = await User.findOne({ username });
        let isOnline = await onlineModel.findOne({user})
        if(user &&  (await user.matchPassword(password))){
            isOnline.online = true;
            isOnline.save();
            delete user.password;
            return res.status(200).json({status: true, user, isOnline: isOnline.online })   
        }else {
            return res.json({ msg: "Incorrect username or password", status: false});
        }
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
}


// Set User avatar
export const setAvatar = async(req, res, next) => {
    const { params: { id: userId }, body:{ image: avatarImage } } = req;
    try {
        let userData = await User.findByIdAndUpdate(userId, {isAvatarImageSet:true, avatarImage},{new:true});
        return res.status(201).json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
}


// helper method
const compare_update_objects = (users, onlines) => {
    let my_list = []
    users.map((user) => {
        onlines.map((item) => {
          if(JSON.stringify(user._id ) === JSON.stringify(item.user)){
            user.online = item.online
            my_list.push(user)
          }
        })
    });
    return my_list;
}


// Get Users on chat
export const getUsers = async(req, res, next) => {
    try {
        let isOnline = await onlineModel.find({}).sort({_id: -1});
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        compare_update_objects(users, isOnline);
        return res.status(200).json(users)
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
}

// Get Users on chat
export const online_users = async(req, res) => {
    try {
        let isOnline =  await onlineModel.find({}).sort({_id: -1});
        const users = await User.find({}).select([
            "email",
            "username",
            "_id"
        ])
       const result = compare_update_objects(users, isOnline);
       res.send(result);
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
}



// User left the chat
export const leaveChat = async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.json({ msg: "User id is required " });
        const user = await User.findById(id);
        let isOnline = await onlineModel.findOne({user});
        isOnline.online = false;
        isOnline.save();
        return res.status(200).send({msg: "User left chat"});
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
};



export const logOut = async(req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (error) {
      console.log({ status: false, msg: "Failed to create user", error });
      return res.status(500).json({ status: false, msg: "Failed to create user" })
  }
};
