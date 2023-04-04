import Message from "../model/messageModel.js"; 


// Add Message to DB 
export const addMessage = async(req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })
        if(data) return res.status(201).json({ msg: "Message added successfully" });
        console.log({ msg: "Operation  Failed" });
        return res.status(400).json({ msg: "Operation  Failed" }) 
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
};




// Fetch message from DB 
export const getAllMessages = async(req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Message.find({
            users:{
                $all:[from, to]
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
        return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
        };
    });
    return res.json(projectedMessages);
    } catch (error) {
        console.log({ status: false, msg: "Failed to create user", error });
        return res.status(500).json({ status: false, msg: "Failed to create user" })
    }
};