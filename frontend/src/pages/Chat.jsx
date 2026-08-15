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
  useTheme,
  Button,
  Chip
} from "@mui/material";
import {
  Send as SendIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";

const Chat = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
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
      fetchConversations(u._id || u.id);
      
      // Check if we came here to chat with a specific user
      if (location.state?.userId) {
        handleInitiateChat(location.state.userId, u._id || u.id);
      }
    }
  }, [location.state]);

  const handleInitiateChat = async (otherUserId, currentUserId) => {
    try {
      // Fetch user details first
      const res = await api.get(`/users/${otherUserId}`);
      const otherUser = res.data;
      setActiveChat(otherUser);
      fetchHistory(otherUser._id || otherUser.id);
      
      // Add to conversations if not already there (optimistically)
      setConversations(prev => {
        if (prev.find(c => (c._id || c.id) === otherUserId)) return prev;
        return [otherUser, ...prev];
      });
    } catch (err) {
      console.error("Error initiating chat", err);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        if (activeChat && (message.sender === (activeChat._id || activeChat.id) || message.sender === (user?._id || user?.id))) {
          setMessages((prev) => {
            if (prev.find(m => (m._id || m.id) === message._id)) return prev;
            return [...prev, message];
          });
        }
        // Refresh conversations list to show last message/updated order
        if (user) fetchConversations(user._id || user.id);
      };

      const handleSwapRequestUpdated = ({ requestId, status }) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.swapRequest && msg.swapRequest._id === requestId) {
              return {
                ...msg,
                swapRequest: {
                  ...msg.swapRequest,
                  status: status
                }
              };
            }
            return msg;
          })
        );
      };

      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("swapRequestUpdated", handleSwapRequestUpdated);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("swapRequestUpdated", handleSwapRequestUpdated);
      };
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
      const res = await api.get(`/chat/history/${user._id || user.id}/${otherUserId}`);
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
      sender: user._id || user.id,
      receiver: activeChat._id || activeChat.id,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const handleUpdateSwapStatus = async (requestId, status) => {
    try {
      await api.put(`/swaps/status/${requestId}`, { status });
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.swapRequest && msg.swapRequest._id === requestId) {
            return {
              ...msg,
              swapRequest: {
                ...msg.swapRequest,
                status: status
              }
            };
          }
          return msg;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSelectChat = (otherUser) => {
    setActiveChat(otherUser);
    fetchHistory(otherUser._id || otherUser.id);
  };

  const filteredConversations = conversations.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.username || "").toLowerCase().includes(search.toLowerCase())
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
                  <React.Fragment key={conv._id || conv.id}>
                    <ListItem 
                      button 
                      onClick={() => handleSelectChat(conv)}
                      selected={(activeChat?._id || activeChat?.id) === (conv._id || conv.id)}
                      sx={{ 
                        py: 2, 
                        px: 3,
                        transition: "all 0.2s",
                        borderLeft: (activeChat?._id || activeChat?.id) === (conv._id || conv.id) ? "4px solid var(--primary)" : "4px solid transparent",
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
                <Box 
                  onClick={() => navigate(`/profile?userId=${activeChat._id || activeChat.id}`)}
                  sx={{ 
                    p: 2, 
                    px: 3, 
                    borderBottom: "1px solid var(--border)", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    "&:hover": { bgcolor: "var(--surface-hover)" }
                  }}
                >
                  <IconButton sx={{ display: { md: "none" } }} onClick={(e) => { e.stopPropagation(); setActiveChat(null); }}>
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
                    {messages.map((msg, i) => {
                      const isMe = msg.sender === (user._id || user.id);
                      if (msg.type === "swap_request" && msg.swapRequest) {
                        const req = msg.swapRequest;
                        const isPending = req.status === "pending";
                        const isAccepted = req.status === "accepted";
                        const isDeclined = req.status === "declined";

                        return (
                          <Box key={i} sx={{ 
                            alignSelf: isMe ? "flex-end" : "flex-start",
                            width: "100%",
                            maxWidth: "360px"
                          }}>
                            <Paper elevation={0} sx={{ 
                              p: 2.5, 
                              borderRadius: "24px",
                              bgcolor: "var(--bg-color)",
                              border: "1px solid var(--border)",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                              position: "relative",
                              overflow: "hidden"
                            }}>
                              {/* Header */}
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Box sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: "50%", 
                                  bgcolor: "var(--primary-glow)", 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center" 
                                }}>
                                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>🤝</Typography>
                                </Box>
                                <Typography variant="subtitle2" fontWeight={800} color="var(--text-main)">
                                  Swap Proposal
                                </Typography>
                              </Stack>

                              {/* Skills Box */}
                              <Stack spacing={1.5} sx={{ mb: 2, p: 2, bgcolor: "var(--surface-color)", borderRadius: "16px" }}>
                                <Box>
                                  <Typography variant="caption" color="var(--text-muted)" sx={{ display: "block", textTransform: "uppercase", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 0.5 }}>
                                    Offering (to teach)
                                  </Typography>
                                  <Typography variant="body2" fontWeight={700} color="var(--primary)" sx={{ mt: 0.5 }}>
                                    {req.skillOffered}
                                  </Typography>
                                </Box>
                                <Divider sx={{ opacity: 0.5 }} />
                                <Box>
                                  <Typography variant="caption" color="var(--text-muted)" sx={{ display: "block", textTransform: "uppercase", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 0.5 }}>
                                    Requesting (to learn)
                                  </Typography>
                                  <Typography variant="body2" fontWeight={700} color="var(--secondary)" sx={{ mt: 0.5 }}>
                                    {req.skillWanted}
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* Message if any */}
                              {req.message && (
                                <Typography variant="body2" color="var(--text-muted)" sx={{ mb: 2, fontStyle: "italic", fontSize: "0.85rem", borderLeft: "3px solid var(--border)", pl: 1.5 }}>
                                  "{req.message}"
                                </Typography>
                              )}

                              {/* Status Area */}
                              <Box sx={{ mt: 2 }}>
                                {isPending ? (
                                  isMe ? (
                                    /* Sender pending state */
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "var(--primary)" }}>
                                      <Box sx={{ 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: "50%", 
                                        bgcolor: "var(--primary)",
                                        animation: "pulse 1.5s infinite"
                                      }} />
                                      <Typography variant="body2" fontWeight={700}>
                                        Waiting for request accept
                                      </Typography>
                                      <style>{`
                                        @keyframes pulse {
                                          0% { opacity: 0.4; }
                                          50% { opacity: 1; }
                                          100% { opacity: 0.4; }
                                        }
                                      `}</style>
                                    </Stack>
                                  ) : (
                                    /* Receiver actions */
                                    <Stack direction="row" spacing={1.5}>
                                      <Button 
                                        variant="contained" 
                                        size="small" 
                                        onClick={() => handleUpdateSwapStatus(req._id, "accepted")}
                                        sx={{ 
                                          flex: 1, 
                                          bgcolor: "var(--primary)", 
                                          color: "white", 
                                          borderRadius: "12px",
                                          fontWeight: 700,
                                          textTransform: "none",
                                          "&:hover": { bgcolor: "var(--primary)", opacity: 0.9 }
                                        }}
                                      >
                                        Accept
                                      </Button>
                                      <Button 
                                        variant="outlined" 
                                        size="small" 
                                        onClick={() => handleUpdateSwapStatus(req._id, "declined")}
                                        sx={{ 
                                          flex: 1, 
                                          color: "var(--text-main)", 
                                          borderColor: "var(--border)",
                                          borderRadius: "12px",
                                          fontWeight: 700,
                                          textTransform: "none",
                                          "&:hover": { borderColor: "var(--text-main)", bgcolor: "var(--surface-hover)" }
                                        }}
                                      >
                                        Decline
                                      </Button>
                                    </Stack>
                                  )
                                ) : isAccepted ? (
                                  <Box sx={{ p: 1, bgcolor: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", textAlign: "center" }}>
                                    <Typography variant="body2" fontWeight={700} color="#10b981">
                                      Accepted 🎉
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ p: 1, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: "12px", textAlign: "center" }}>
                                    <Typography variant="body2" fontWeight={700} color="#ef4444">
                                      Declined
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Paper>
                            <Typography variant="caption" sx={{ mt: 0.5, display: "block", textAlign: isMe ? "right" : "left", color: "var(--text-muted)", fontSize: "0.65rem" }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        );
                      }

                      // Else render text message
                      return (
                        <Box key={i} sx={{ 
                          alignSelf: isMe ? "flex-end" : "flex-start",
                          maxWidth: "70%"
                        }}>
                          <Paper elevation={0} sx={{ 
                            p: 1.5, 
                            px: 2,
                            borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                            bgcolor: isMe ? "var(--primary)" : "var(--bg-color)",
                            color: isMe ? "var(--text-on-primary)" : "var(--text-main)",
                            boxShadow: isMe ? "0 4px 12px var(--primary-glow)" : "0 2px 4px rgba(0,0,0,0.02)",
                            border: isMe ? "none" : "1px solid var(--border)"
                          }}>
                            <Typography variant="body2">{msg.text}</Typography>
                          </Paper>
                          <Typography variant="caption" sx={{ mt: 0.5, display: "block", textAlign: isMe ? "right" : "left", color: "var(--text-muted)", fontSize: "0.65rem" }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      );
                    })}
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
