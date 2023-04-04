import React, {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader_800.gif';
import { Buffer } from "buffer";
import { AvatarContainer } from'../pages/style';
import {ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes'


const toastParam = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}

const SetAvatar = () => {

    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate()

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);


    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) { navigate("/login"); }  
        }  
        return () => isMounted = false;
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastParam);
        }else{
            const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{image: avatars[selectedAvatar],});
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem( process.env.REACT_APP_LOCALHOST_KEY,  JSON.stringify(user) );
                navigate("/login");
            }else{
                toast.error("Error setting avatar. Please try again.", toastParam);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        (async() => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            if(isMounted){
                setAvatars(data);
                setIsLoading(false);
            }
        })()
        return () => isMounted = false;
    }, [api]);
  
    return (
        <>
            {
                isLoading ? 
                (
                    <AvatarContainer>
                        <img src={loader} alt="loader"/>
                    </AvatarContainer> 
                ): (
                    <AvatarContainer>
                        <div className="title-container">
                            <h1>
                                Pick an avatar as your profile picture
                            </h1>
                        </div>
                        <div className="avatars">
                            {
                                avatars.map((avatar, index) => (
                                    <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`} key={index}> 
                                        <img
                                            src={`data:image/svg+xml;base64,${avatar}`}
                                            alt="avatar"
                                            key={avatar}
                                            onClick={() => setSelectedAvatar(index)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <button onClick={setProfilePicture} className="submit-btn">
                            Set as Profile Picture
                        </button>
                    </AvatarContainer>
                )
            }
            <ToastContainer />
        </>
    )
}

export default SetAvatar