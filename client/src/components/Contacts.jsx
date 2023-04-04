import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import { ContactWrapper, Button } from '../pages/style';
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { leaveRoute } from "../utils/APIRoutes";

const Contacts = ({ contacts, changeChat }) => {

  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    (async() => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if(isMounted){
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      }
    })();
    return () => { isMounted = false; }
  },[]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleClick = async () => {
    const { _id: id } = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
    const data = await axios.post(`${leaveRoute}/${id}`);
    if (data.status === 200) {
      navigate("/login");
    }
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <ContactWrapper>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>chatty</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : "" }`}
                  onClick={() => changeCurrentChat(index, contact)}>

                  <div className={contact.online ? `avatar-online`: "avatar"}>
                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt=""/>
                  </div>

                  <div className={contact.online ? "username-online" : "username"}>
                    <h3>{contact.username}</h3>
                    <p>{contact.online ? "Online" : "offline"}</p>
                  </div>
                  
                </div>
              );
            })}
          </div>
          <div className="current-user">
              <Button>
                <BiPowerOff onClick={handleClick}/>
              </Button>
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar" />
                <div className="username">
                  <h2>{currentUserName}</h2>
                </div>
              </div>
          </div>
        </ContactWrapper>
      )}
    </>
  );
}


export default Contacts;