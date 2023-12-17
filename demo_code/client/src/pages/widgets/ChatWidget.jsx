import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import {
    Box,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    TextField, Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Chat as ChatIcon, Delete as DeleteIcon } from "@mui/icons-material";
import './ChatWidget.css'
import { io } from "socket.io-client";
import { Person as PersonIcon } from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const socket = io("http://localhost:3500");
function SendIcon() {
    return null;
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]); // Array of chats
    const [selectedChat, setSelectedChat] = useState(null); // Currently selected chat
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [messageInput, setMessageInput] = useState('');
    const navigate = useNavigate(); // Make sure to import useNavigate from 'react-router-dom'


    const navigateToUserProfile = (chat) => {
        // Assuming the user profile route is '/profile/:username'
        const username = user.username === chat.sender.username ? chat.receiver.username : chat.sender.username;
        navigate(`/profile/${username}`);
    };


    useEffect(() => {
        // Fetch and set chats here
        const fetchChat = async () => {
            try {
                const response = await fetch(`http://localhost:3500/users/chat/${user._id}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}`},
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const fetchedChats = await response.json();
                console.log(fetchedChats)
                setChats(fetchedChats);
            } catch (error) {
                console.error("Error fetching listing:", error);
                // Handle errors appropriately
            }
        };
        fetchChat();
    }, []);

    const selectChat = (chat) => {
        setSelectedChat(chat);
    };

    const renderReceiverUsername = (chat) => {
        if(user.username === chat.sender.username)
            return chat.receiver.username
        else if(user.username === chat.receiver.username)
            return chat.sender.username
    };
    const renderMessages = (chat) => {
        return chat.messages.map((message) => {
            // Determine if the message is from the current user
            const isFromCurrentUser = message.from === user._id; // Adjust based on your data structure
            const messageClass = isFromCurrentUser ? 'message-from-current-user' : 'message-from-other-user';
            return (
                <div key={message._id} className={`message-item ${messageClass}`}>
                    {message.content}
                </div>
            );
        });
    };

    const [isSending, setIsSending] = useState(false);
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return; // Prevent sending empty messages
        if(isSending) return;

        setIsSending(true)
        try {
            let messageObj
            if(user.username === selectedChat.sender.username)
            {
                messageObj = {sender_username: user.username, receiver_username: selectedChat.receiver.username, content: messageInput}
            }
            else
                messageObj = {receiver_username: selectedChat.sender.username, sender_username: user.username,content: messageInput}
            // Logic to send the message to the server
            const response = await fetch(`http://localhost:3500/messages/create-message`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageObj),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            // Emit event to server
            socket.emit("sendMessage", messageObj);
            setMessageInput('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        socket.on("newMessage", (message) => {
            setChats(prevChats => prevChats.map(chat => {
                if (((chat.receiver._id === message.from) && (chat.sender._id === message.to) ||
                    ((chat.receiver._id === message.to) && (chat.sender._id === message.from)))) {
                    return {...chat, messages: [...chat.messages, message]};
                }
                return chat;
            }));

            // If the new message is for the currently selected chat, update it as well
                if (((selectedChat.receiver._id === message.from) && (selectedChat.sender._id === message.to) ||
                    ((selectedChat.receiver._id === message.to) && (selectedChat.sender._id === message.from)))) {
                setSelectedChat(prevSelectedChat => ({
                    ...prevSelectedChat,
                    messages: [...prevSelectedChat.messages, message]
                }));
            }
        });
        return () => {
            setIsSending(false)
            socket.off("newMessage");
        };
    }, [selectedChat]);

    useEffect(() => {
        socket.on("deletedChat", (deletedChat) => {
            setChats(prevChats => prevChats.filter(chat => chat._id !== deletedChat._id));
        });

        return () => {
            socket.off("newMessage");
            socket.off("deletedChat");
        };
    }, [selectedChat]);

    const getChatTitle = (chat) => {
        return user.username === chat.sender.username ? chat.receiver.username : chat.sender.username;
    };

    const handleDeleteChat = async (chat) => {
        try {
            const chatObj = {receiver_username: chat.receiver.username ,sender_username: chat.sender.username}
            const response = await fetch(`http://localhost:3500/chat/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chatObj),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            // Process response and update chat messages
            setMessageInput(''); // Clear input field
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {isOpen && (
                <Paper elevation={6} sx={{ width: 300, height: 400, overflow: 'auto', position: 'absolute', bottom: 70, right: 0, borderRadius: '10px' }}>
                    {!selectedChat ? (
                        <List sx={{ padding: 0 }}>
                            {chats.map((chat) => (
                                <ListItem
                                    key={chat._id}
                                    sx={{
                                        padding: '10px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                                        },
                                    }}
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" onClick={() => handleDeleteChat(chat)} sx={{ color: 'red' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton edge="end" onClick={() => navigateToUserProfile(chat)}>
                                                <PersonIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <Avatar sx={{ bgcolor: 'primary.main', marginRight: '10px' }}>
                                        {renderReceiverUsername(chat)[0].toUpperCase()}
                                    </Avatar>
                                    <ListItemText
                                        primary={renderReceiverUsername(chat)}
                                        onClick={() => setSelectedChat(chat)}
                                        primaryTypographyProps={{ fontWeight: 'bold' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <IconButton sx={{ position: 'absolute', top: 1, left: 1 }} onClick={() => setSelectedChat(null)}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography sx={{ textAlign: 'center', py: 1, backgroundColor: '#007bff', color: 'white', fontSize: '1rem' }}>
                                {getChatTitle(selectedChat)}
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
                                    {selectedChat.messages.map((message) => (
                                    <Box key={message._id} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: message.from === user._id ? 'flex-end' : 'flex-start', // Align based on the sender
                                        my: 1,
                                        mx: 2
                                    }}>
                                        <Paper sx={{
                                            bgcolor: message.from === user._id ? '#81b963' : '#a99a9a',
                                            borderRadius: 2,
                                            py: 1,
                                            px: 2
                                        }}>
                                            {message.content}
                                        </Paper>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', borderTop: 1, borderColor: 'divider' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    sx={{ mr: 1 }}
                                />
                                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            )}
            <IconButton color="secondary" onClick={() => setIsOpen(!isOpen)}>
                <ChatIcon sx = {{fontSize: 55}}/>
            </IconButton>
        </Box>
    );


};

export default ChatWidget;