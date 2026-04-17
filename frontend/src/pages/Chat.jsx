import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Stack,
  alpha,
  useTheme
} from "@mui/material";
import {
  Send as SendIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { useLocation } from "react-router-dom";

const Chat = () => {
  const socket = useSocket();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      fetchConversations(u._id);
      
      // Check if we came here to chat with a specific user
      if (location.state?.userId) {
        handleInitiateChat(location.state.userId, u._id);
      }
    }
  }, [location.state]);

  const handleInitiateChat = async (otherUserId, currentUserId) => {
    try {
      // Fetch user details first
      const res = await api.get(`/users/${otherUserId}`);
      const otherUser = res.data;
      setActiveChat(otherUser);
      fetchHistory(otherUser._id);
      
      // Add to conversations if not already there (optimistically)
      setConversations(prev => {
        if (prev.find(c => c._id === otherUserId)) return prev;
        return [otherUser, ...prev];
      });
    } catch (err) {
      console.error("Error initiating chat", err);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        if (activeChat && (message.sender === activeChat._id || message.sender === user?._id)) {
          setMessages((prev) => [...prev, message]);
        }
        // Refresh conversations list to show last message/updated order
        if (user) fetchConversations(user._id);
      });

      return () => socket.off("receiveMessage");
    }
  }, [socket, activeChat, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async (userId) => {
    try {
      const res = await api.get(`/chat/conversations/${userId}`);
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  const fetchHistory = async (otherUserId) => {
    try {
      const res = await api.get(`/chat/history/${user._id}/${otherUserId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;

    const messageData = {
      sender: user._id,
      receiver: activeChat._id,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const handleSelectChat = (otherUser) => {
    setActiveChat(otherUser);
    fetchHistory(otherUser._id);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: "var(--surface-color)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 2, md: 4 }, height: "calc(100vh - 80px)", display: "flex" }}>
        <Paper elevation={0} sx={{ 
          display: "flex", 
          width: "100%", 
          borderRadius: 6, 
          overflow: "hidden", 
          border: "1px solid var(--border)",
          bgcolor: "var(--bg-color)"
        }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: { xs: activeChat ? "0%" : "100%", md: "350px" }, 
            display: { xs: activeChat ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            borderRight: "1px solid var(--border)"
          }}>
            <Box sx={{ p: 3, borderBottom: "1px solid var(--border)" }}>
              <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>Messages</Typography>
              <TextField 
                fullWidth 
                placeholder="Search mentors..." 
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "var(--text-muted)", mr: 1, fontSize: 20 }} />,
                  sx: { borderRadius: "12px", bgcolor: "var(--surface-color)", '& fieldset': { border: 'none' } }
                }}
              />
            </Box>
            
            <List sx={{ flexGrow: 1, overflowY: "auto", py: 0 }}>
              {filteredConversations.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center", color: "var(--text-muted)" }}>
                  <Typography variant="body2">No conversations found.</Typography>
                </Box>
              ) : (
                filteredConversations.map((conv) => (
                  <React.Fragment key={conv._id}>
                    <ListItem 
                      button 
                      onClick={() => handleSelectChat(conv)}
                      selected={activeChat?._id === conv._id}
                      sx={{ 
                        py: 2, 
                        px: 3,
                        transition: "all 0.2s",
                        borderLeft: activeChat?._id === conv._id ? "4px solid var(--primary)" : "4px solid transparent",
                        "&:hover": { bgcolor: "var(--surface-hover)" },
                        "&.Mui-selected": { bgcolor: "var(--primary-glow)", "&:hover": { bgcolor: "var(--primary-glow)" } }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={conv.profileImage} sx={{ width: 48, height: 48, bgcolor: "var(--primary-glow)", color: "var(--primary)", fontWeight: 700 }}>
                          {conv.name?.charAt(0) || conv.username?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography fontWeight={700}>{conv.name || conv.username}</Typography>}
                        secondary={<Typography variant="body2" color="var(--text-muted)" noWrap>Click to view chat</Typography>}
                      />
                    </ListItem>
                    <Divider sx={{ mx: 2, opacity: 0.5 }} />
                  </React.Fragment>
                ))
              )}
            </List>
          </Box>

          {/* Chat Area */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: activeChat ? "flex" : "none", md: "flex" }, 
            flexDirection: "column",
            bgcolor: "var(--bg-color)" 
          }}>
            {activeChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, px: 3, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton sx={{ display: { md: "none" } }} onClick={() => setActiveChat(null)}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar src={activeChat.profileImage} sx={{ width: 40, height: 40, bgcolor: "var(--primary-glow)", color: "var(--primary)" }}>
                    {activeChat.name?.charAt(0) || activeChat.username?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800}>{activeChat.name || activeChat.username}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CircleIcon sx={{ fontSize: 8, color: "#10b981" }} />
                      <Typography variant="caption" color="var(--text-muted)">Active now</Typography>
                    </Stack>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto", bgcolor: "var(--surface-color)" }}>
                  <Stack spacing={2}>
                    {messages.map((msg, i) => (
                      <Box key={i} sx={{ 
                        alignSelf: msg.sender === user._id ? "flex-end" : "flex-start",
                        maxWidth: "70%"
                      }}>
                        <Paper elevation={0} sx={{ 
                          p: 1.5, 
                          px: 2,
                          borderRadius: msg.sender === user._id ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                          bgcolor: msg.sender === user._id ? "var(--primary)" : "var(--bg-color)",
                          color: msg.sender === user._id ? "var(--text-on-primary)" : "var(--text-main)",
                          boxShadow: msg.sender === user._id ? "0 4px 12px var(--primary-glow)" : "0 2px 4px rgba(0,0,0,0.02)",
                          border: msg.sender === user._id ? "none" : "1px solid var(--border)"
                        }}>
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                        <Typography variant="caption" sx={{ mt: 0.5, display: "block", textAlign: msg.sender === user._id ? "right" : "left", color: "var(--text-muted)", fontSize: "0.65rem" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Stack>
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 3, borderTop: "1px solid var(--border)" }}>
                  <form onSubmit={handleSendMessage}>
                    <Stack direction="row" spacing={2}>
                      <TextField 
                        fullWidth 
                        placeholder="Type a message..." 
                        variant="outlined"
                        size="medium"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        autoComplete="off"
                        InputProps={{
                          sx: { borderRadius: "16px", bgcolor: "var(--surface-color)", '& fieldset': { border: 'none' } }
                        }}
                      />
                      <IconButton 
                        type="submit"
                        disabled={!newMessage.trim()}
                        sx={{ 
                          bgcolor: "var(--primary)", 
                          color: "var(--text-on-primary)", 
                          width: 50, 
                          height: 50,
                          "&:hover": { bgcolor: "var(--primary)", opacity: 0.9 },
                          "&.Mui-disabled": { bgcolor: "var(--surface-hover)" }
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Stack>
                  </form>
                </Box>
              </>
            ) : (
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, color: "var(--text-muted)" }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%", 
                  bgcolor: "var(--primary-glow)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 3
                }}>
                  <SendIcon sx={{ fontSize: 32, color: "var(--primary)", transform: "rotate(-45deg)", ml: 0.5 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="var(--text-main)" gutterBottom>Your Messages</Typography>
                <Typography variant="body2" textAlign="center" maxWidth={300}>Select a conversation to start chatting with your mentors and peers.</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Chat;
