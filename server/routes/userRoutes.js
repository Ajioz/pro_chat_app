import express from 'express'
import { 
    getUsers, 
    leaveChat, 
    login, 
    logOut, 
    online_users, 
    register, 
    setAvatar, 
} from '../controllers/userController.js';


const userRoute = express.Router();


userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/setAvatar/:id', setAvatar);
userRoute.post("/leaveChat/:id", leaveChat);
userRoute.get('/allUsers/:id', getUsers);
userRoute.get('/online/', online_users);
userRoute.get("/logout/:id", logOut);


export default userRoute;