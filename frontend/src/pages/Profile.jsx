import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon
} from "@mui/icons-material";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SwapModal from "../components/SwapModal";
import { cacheAvatar, cacheAvatarFile, getCachedAvatar } from "../utils/avatarCache.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Edit profile dialog states
  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSkillsOffered, setEditSkillsOffered] = useState("");
  const [editSkillsWanted, setEditSkillsWanted] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [cachedAvatar, setCachedAvatar] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewUserId = searchParams.get("userId");

  const loggedInUserStr = localStorage.getItem("user");
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
  const isOwnProfile = !viewUserId || viewUserId === loggedInUser?._id || viewUserId === loggedInUser?.id;

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const handleOpenEdit = () => {
    setEditUsername(user?.username || "");
    setEditTitle(user?.title || "");
    setEditBio(user?.bio || "");
    setEditLocation(user?.location || "");
    setEditSkillsOffered((user?.skillsOffered || []).join(", "));
    setEditSkillsWanted((user?.skillsWanted || []).join(", "));
    setEditAvatarFile(null);
    setEditAvatarPreview(cachedAvatar || user?.avatar || "");
    setEditOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setEditAvatarFile(null);
    setEditAvatarPreview("");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", editUsername);
      formData.append("title", editTitle);
      formData.append("bio", editBio);
      formData.append("location", editLocation);

      const skillsOfferedArray = editSkillsOffered.split(",").map(s => s.trim()).filter(Boolean);
      const skillsWantedArray = editSkillsWanted.split(",").map(s => s.trim()).filter(Boolean);

      formData.append("skillsOffered", JSON.stringify(skillsOfferedArray));
      formData.append("skillsWanted", JSON.stringify(skillsWantedArray));

      if (editAvatarFile) {
        formData.append("avatarFile", editAvatarFile);
      } else if (editAvatarPreview === "") {
        formData.append("avatarUrl", "");
      }

      const res = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedUser = res.data.user;

      setUser(prev => ({
        ...prev,
        ...updatedUser,
        profileCompletion: updatedUser.avatar ? 100 : 85
      }));

      // Update localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const localUser = JSON.parse(userStr);
        const newLocalUser = { ...localUser, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(newLocalUser));
      }

      // Sync local storage avatar cache
      if (editAvatarFile) {
        const base64 = await cacheAvatarFile(editAvatarFile).catch(err => console.error(err));
        if (base64) setCachedAvatar(base64);
      } else if (editAvatarPreview === "") {
        localStorage.removeItem("cachedAvatar");
        setCachedAvatar("");
      } else if (updatedUser.avatar) {
        const base64 = await cacheAvatar(updatedUser.avatar).catch(err => console.error(err));
        if (base64) setCachedAvatar(base64);
      } else {
        localStorage.removeItem("cachedAvatar");
        setCachedAvatar("");
      }

      setEditOpen(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert(err.response?.data?.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Dummy data for projects and reviews (as requested)
  const dummyProjects = [
    {
      id: 1,
      title: "Expense Tracker",
      description: "A full-stack application to track daily expenses with data visualization using Chart.js.",
      link: "https://github.com/rajitmaurya/expense-tracker"
    },
    {
      id: 2,
      title: "Quiz App",
      description: "An interactive real-time quiz platform built with React and Socket.io for multiplayer experience.",
      link: "https://github.com/rajitmaurya/quiz-app"
    }
  ];

  const dummyReviews = [
    {
      id: 1,
      user: "Amit Sharma",
      avatar: "",
      rating: 5,
      comment: "Rajit is an excellent mentor! His Node.js explanations were crystal clear."
    },
    {
      id: 2,
      user: "Sneha Patel",
      avatar: "",
      rating: 4,
      comment: "Great session on React hooks. Very patient and knowledgeable."
    }
  ];

  useEffect(() => {
    const cached = getCachedAvatar();
    setCachedAvatar(cached);

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const endpoint = isOwnProfile ? "/auth/profile" : `/users/${viewUserId}`;
        const res = await api.get(endpoint);
        const profile = res.data;
        setUser({
          ...profile,
          username: profile.username || "",
          bio: profile.bio || "",
          location: profile.location || "",
          skillsOffered: profile.skillsOffered || [],
          skillsWanted: profile.skillsWanted || [],
          profileCompletion: profile.avatar ? 100 : 85
        });

        if (isOwnProfile && profile.avatar && !cached) {
          cacheAvatar(profile.avatar).then(base64 => {
            if (base64) setCachedAvatar(base64);
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401 && isOwnProfile) {
          navigate("/login");
        } else {
             // For demonstration purposes, if backend fails or user not logged in, set dummy user
             setUser({
                username: isOwnProfile ? "Rajit Maurya" : "Bob Dev",
                bio: isOwnProfile ? "Full Stack Developer | MERN" : "Node.js Mentor | Backend Engineer",
                location: "Lucknow, India",
                email: isOwnProfile ? "rajit@example.com" : "bob@example.com",
                skillsOffered: isOwnProfile ? ["React", "Node.js", "MongoDB"] : ["Node.js", "Express"],
                skillsWanted: isOwnProfile ? ["AI", "Machine Learning"] : ["React", "CSS"],
                profileCompletion: 85,
                avatar: ""
              });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, viewUserId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f7f9" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh" }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 4, mt: 4 }}>
        <Grid container spacing={3}>
          
          {/* Main Left Column */}
          <Grid item xs={12} md={8}>
            
            {/* 1. Profile Header */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 4, 
                mb: 3, 
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Cover Background (LinkedIn style) */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '100px', 
                  background: 'linear-gradient(90deg, #4f46e5 0%, #a855f7 100%)' 
                }} 
              />
              
              <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: 3 }}>
                <Avatar 
                  src={isOwnProfile ? (cachedAvatar || user?.avatar) : user?.avatar} 
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    border: '5px solid white', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    bgcolor: '#4f46e5',
                    fontSize: '3rem'
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' }, mb: 1 }}>
                  <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#111827' }}>
                    {user?.username}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    {user?.bio}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center" sx={{ color: 'text.secondary' }}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2">{user?.location}</Typography>
                  </Stack>
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {isOwnProfile ? (
                    <Button 
                      variant="contained" 
                      startIcon={<EditIcon />}
                      onClick={handleOpenEdit}
                      sx={{ 
                          borderRadius: '20px', 
                          px: 3, 
                          bgcolor: '#111827', 
                          '&:hover': { bgcolor: '#1f2937' },
                          textTransform: 'none',
                          fontWeight: 600
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="contained" 
                        onClick={() => setIsSwapModalOpen(true)}
                        sx={{ 
                            borderRadius: '20px', 
                            px: 3, 
                            bgcolor: '#4f46e5', 
                            '&:hover': { bgcolor: '#4338ca' },
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                      >
                        Request Swap
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => navigate("/chat", { state: { userId: user?._id || user?.id } })}
                        sx={{ 
                            borderRadius: '20px', 
                            px: 3, 
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                      >
                        Message
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outlined" 
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                        borderRadius: '20px', 
                        px: 3, 
                        borderWidth: '2px',
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                  >
                    Follow
                  </Button>
                </Stack>
              </Box>
            </Paper>

            {/* 2. Skills Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Professional Skills
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="700" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills I Offer
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.skillsOffered.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      color="primary" 
                      variant="soft" 
                      sx={{ 
                        bgcolor: '#e0e7ff', 
                        color: '#4338ca', 
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }} 
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="700" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills I Want to Learn
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.skillsWanted.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      sx={{ 
                        bgcolor: '#fdf2f8', 
                        color: '#be185d', 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        border: '1px solid #fbcfe8'
                      }} 
                    />
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* 3. Projects Section */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, px: 1 }}>
              Featured Projects
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {dummyProjects.map((project) => (
                <Grid item xs={12} sm={6} key={project.id}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: 4, 
                        border: '1px solid #e5e7eb',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                        }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button size="small" startIcon={<GitHubIcon />} href={project.link} target="_blank" sx={{ textTransform: 'none', color: '#111827', fontWeight: 600 }}>
                        View on GitHub
                      </Button>
                      <Button size="small" startIcon={<LaunchIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Live Demo
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* 4. Ratings & Reviews */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Ratings & Reviews
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={4.5} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" fontWeight="700">4.5 / 5.0</Typography>
                </Stack>
              </Box>
              
              <List disablePadding>
                {dummyReviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }}>
                          {review.user.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="bold">{review.user}</Typography>
                            <Rating value={review.rating} size="small" readOnly />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {review.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < dummyReviews.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            
            {/* 5. Profile Completion */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Profile Completion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={user?.profileCompletion} 
                    sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        bgcolor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#10b981'
                        }
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="700">
                  {user?.profileCompletion}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Complete your profile to get 2x more swap requests!
              </Typography>
            </Paper>

            {/* Quick Actions / Info */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Quick Info
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon fontSize="small" sx={{ color: '#6b7280' }} />
                  <Typography variant="body2">{user?.email || "rajit@example.com"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} />
                  <Typography variant="body2">Identity Verified</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                  <Typography variant="body2">Top Mentor 2024</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                    borderRadius: '12px', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    borderColor: '#e5e7eb',
                    color: '#374151',
                    '&:hover': {
                        borderColor: '#d1d5db',
                        bgcolor: '#f9fafb'
                    }
                }}
              >
                Connect on LinkedIn
              </Button>
            </Paper>

          </Grid>

        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editOpen} 
        onClose={() => !saving && setEditOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 1 }}>
            <Avatar 
              src={editAvatarPreview} 
              sx={{ width: 100, height: 100, mb: 2, bgcolor: '#4f46e5', border: '3px solid #e0e7ff' }}
            >
              {editUsername?.charAt(0).toUpperCase()}
            </Avatar>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" component="label" size="small" sx={{ textTransform: 'none', borderRadius: '15px' }}>
                Choose Photo
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </Button>
              {editAvatarPreview && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={handleRemoveAvatar}
                  sx={{ textTransform: 'none', borderRadius: '15px' }}
                >
                  Remove Photo
                </Button>
              )}
            </Stack>
          </Box>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Professional Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
            <TextField
              label="Location"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Skills Offered (comma-separated)"
              value={editSkillsOffered}
              onChange={(e) => setEditSkillsOffered(e.target.value)}
              fullWidth
              variant="outlined"
              helperText="E.g., React, Node.js, Python, Figma"
            />
            <TextField
              label="Skills Wanted (comma-separated)"
              value={editSkillsWanted}
              onChange={(e) => setEditSkillsWanted(e.target.value)}
              fullWidth
              variant="outlined"
              helperText="E.g., AI, Machine Learning, UI Design"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setEditOpen(false)} 
            disabled={saving}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            disabled={saving}
            variant="contained"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              bgcolor: '#4f46e5',
              borderRadius: '15px',
              px: 3,
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        receiver={user}
      />

      <Footer />
    </Box>
  );
};

export default Profile;