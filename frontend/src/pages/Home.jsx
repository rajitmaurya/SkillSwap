import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  alpha,
  useTheme,
  Paper
} from "@mui/material";
import {
  TrendingUp as TrendingIcon,
  Verified as VerifiedIcon,
  SwapHoriz as SwapIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const trendingSkills = ["React.js", "Python", "Data Science", "UI/UX Design", "Machine Learning", "Backend Dev"];

  const featuredUsers = [
    { name: "Rajit Maurya", title: "Full Stack Developer", skills: ["React", "Node.js", "MongoDB"], avatar: "R" },
    { name: "Sarah Chen", title: "UI/UX Designer", skills: ["Figma", "Adobe XD", "Branding"], avatar: "S" },
    { name: "Marcus Thorne", title: "Marketing Lead", skills: ["SEO", "Google Ads", "Content"], avatar: "M" }
  ];

  const steps = [
    { icon: <PersonAddIcon color="primary" />, title: "Create Profile", desc: "Build your professional profile with your expertise." },
    { icon: <SwapIcon color="primary" />, title: "Add Skills", desc: "List what you can teach and what you want to learn." },
    { icon: <SearchIcon color="primary" />, title: "Find People", desc: "Search and connect with experienced mentors." },
    { icon: <SchoolIcon color="primary" />, title: "Start Learning", desc: "Exchange value and grow your skills together." }
  ];

  return (
    <Box sx={{ bgcolor: "#fafbfc", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <Box sx={{
        pt: { xs: 10, md: 15 },
        pb: { xs: 8, md: 12 },
        textAlign: "center",
        background: "radial-gradient(circle at top right, rgba(79, 70, 229, 0.05), transparent 70%)"
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            fontWeight={950}
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              letterSpacing: "-2.5px",
              lineHeight: 1.1,
              mb: 3
            }}
          >
            Exchange Skills,<br />
            <span style={{ color: "#4f46e5" }}>Grow Together</span>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 6, fontWeight: 500, maxWidth: 600, mx: "auto" }}
          >
            The world's first peer-to-peer knowledge exchange platform. Learn by teaching others and build your expert network.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/explore")}
              sx={{ px: 5, py: 1.8, borderRadius: "50px", fontWeight: 800, textTransform: "none", bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}
            >
              Explore Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ px: 5, py: 1.8, borderRadius: "50px", fontWeight: 800, textTransform: "none", borderWidth: "2px", borderColor: "#e5e7eb", color: "#111827", "&:hover": { borderWidth: "2px", borderColor: "#4f46e5" } }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Trending Skills */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: "1px solid #eef2f6", textAlign: "center", bgcolor: "#fff" }}>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <TrendingIcon color="primary" />
            <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>Trending Skills</Typography>
          </Stack>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
            {trendingSkills.map(skill => (
              <Chip
                key={skill}
                label={skill}
                onClick={() => navigate(`/explore?skill=${skill}`)}
                sx={{ px: 1, py: 2.5, borderRadius: "12px", fontWeight: 600, bgcolor: "#fff", border: "1px solid #e5e7eb", "&:hover": { bgcolor: "#4f46e5", color: "#fff", borderColor: "#4f46e5" } }}
              />
            ))}
          </Box>
        </Paper>
      </Container>

      {/* Featured Users */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Typography variant="h4" fontWeight={900} textAlign="center" sx={{ mb: 6 }}>Featured Mentors</Typography>
        <Grid container spacing={4}>
          {featuredUsers.map((user, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-10px)", borderColor: "#4f46e5" }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Avatar
                    sx={{ width: 80, height: 80, mx: "auto", mb: 3, bgcolor: alpha("#4f46e5", 0.1), color: "#4f46e5", fontWeight: 900, fontSize: "1.5rem" }}
                  >
                    {user.avatar}
                  </Avatar>
                  <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" fontWeight="800">{user.name}</Typography>
                    <VerifiedIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{user.title}</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center", mb: 4 }}>
                    {user.skills.map(s => (
                      <Chip key={s} label={s} size="small" sx={{ fontSize: "0.7rem", fontWeight: 700 }} />
                    ))}
                  </Box>
                  <Button variant="contained" fullWidth disableElevation sx={{ borderRadius: 3, fontWeight: 800, textTransform: "none", bgcolor: "#111827" }}>
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ py: 12, bgcolor: "#f1f5f9" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={900} textAlign="center" sx={{ mb: 8 }}>How SkillSwap Works</Typography>
          <Grid container spacing={4}>
            {steps.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ width: 70, height: 70, borderRadius: "20px", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
                    {step.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} gutterBottom>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
