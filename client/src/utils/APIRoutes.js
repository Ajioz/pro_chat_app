export const host = process.env.REACT_APP_URL;
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const leaveRoute = `${host}/api/auth/leaveChat`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const onlineUsers = `${host}/api/auth/online/`;
export const sendMessageRoute = `${host}/api/messages/add_msg`;
export const recieveMessageRoute = `${host}/api/messages/get_msg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;