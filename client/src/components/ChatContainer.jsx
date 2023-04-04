import React, { useState, useEffect, useRef } from "react";
import { Chatty } from '../pages/style'
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";


const ChatContainer = ({currentChat, socket }) => {

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async() => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      if (isMounted) { setMessages(response.data);}
    })();
    return () => { isMounted = false; }
  }, [currentChat]);
  
  useEffect(() => {
      let isMounted = true;
      const getCurrentChat = async () => {
        if (currentChat) {
          await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
        }
      };
      if(isMounted) getCurrentChat();
      return () => { isMounted = false; }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    
  };

  useEffect(() => {
    let isMounted = true;    
    if(isMounted){
      if (socket.current) {
        socket.current.on("msg-recieve", (msg) => {
          setArrivalMessage({ fromSelf: false, message: msg });
        });
      }
    }
    return () => { isMounted = false; }
  }, [socket]);
    
  useEffect(() => {
    let isMounted = true;    
    if(isMounted){ 
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }
    return () => { isMounted = false; }
  }, [arrivalMessage]);
  
  useEffect(() => {
    let isMounted = true;    
    if (isMounted) { 
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => { isMounted = false; }
  }, [messages]);

  return (
    <>
      {currentChat && (
          <Chatty>
              <div className="chat-header">
                <div className="user-details">
                  <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt=""/>
                  </div>
                  <div className="username">
                    <h3>{currentChat.username}</h3>
                  </div>
                </div>
                <Logout />
              </div>
              <div className="chat-messages">
                 {messages.map((message) => {
                    return (
                      <div ref={scrollRef} key={uuidv4()}>
                        <div className={`message ${ message.fromSelf ? "sended" : "recieved" }`} >
                          <div className="content ">
                            <p>{message.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Chatty>
        )
      }
    </>
  );
}



export default ChatContainer;
