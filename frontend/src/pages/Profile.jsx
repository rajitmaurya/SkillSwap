import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/profile");
        // Fallback to dummy data if fields are missing in backend
        const profile = res.data;
        setUser({
          ...profile,
          username: profile.username || "Rajit Maurya",
          bio: profile.bio || "Full Stack Developer | MERN | Open Source Enthusiast",
          location: profile.location || "Lucknow, India",
          skillsOffered: profile.skillsOffered?.length ? profile.skillsOffered : ["React", "Node.js", "MongoDB"],
          skillsWanted: profile.skillsWanted?.length ? profile.skillsWanted : ["AI", "Machine Learning"],
          profileCompletion: 85 // Static dummy progress
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        // If API fails, we navigate to login to ensure safety, or just show dummy data for preview
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
             // For demonstration purposes, if backend fails, set dummy user
             setUser({
                username: "Rajit Maurya",
                bio: "Full Stack Developer | MERN | Open Source Enthusiast",
                location: "Lucknow, India",
                email: "rajit@example.com",
                skillsOffered: ["React", "Node.js", "MongoDB"],
                skillsWanted: ["AI", "Machine Learning"],
                profileCompletion: 85,
                avatar: ""
              });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
                  src={user?.avatar} 
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
                  <Button 
                    variant="contained" 
                    startIcon={<EditIcon />}
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

      <Footer />
    </Box>
  );
};

export default Profile;