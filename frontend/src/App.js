import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
} from "@mui/material";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIncident from "./pages/ReportIncident";
import MyIncidents from "./pages/MyIncidents";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg,#0f172a 0%,#1e293b 45%,#2563eb 100%)",
        color: "white",
        borderRadius: 5,
        mt: 4,
        p: 6,
      }}
    >
      <Box maxWidth="650px">
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
        >
          Cloud-Native Incident Reporting Platform
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            opacity: 0.9,
            lineHeight: 1.7,
          }}
        >
          Report, monitor and analyse incidents through a secure cloud-native
          application powered by FastAPI, React, MongoDB and Docker.
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            mr: 2,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: "bold",
          }}
        >
          Get Started
        </Button>

        <Button
          component={Link}
          to="/dashboard"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            color: "white",
            borderColor: "white",
          }}
        >
          Dashboard
        </Button>
      </Box>

      <Box>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2784/2784487.png"
          alt="Incident Dashboard"
          width="360"
        />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />

      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#0f172a",
          boxShadow: 4,
        }}
      >
        <Toolbar>

          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
            }}
          >
            IncidentCloud
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>

          <Button color="inherit" component={Link} to="/report">
            Report
          </Button>

          <Button color="inherit" component={Link} to="/my-incidents">
            My Incidents
          </Button>

          <Button color="inherit" component={Link} to="/analytics">
            Analytics
          </Button>

          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>

          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>

          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>

        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          mt: 3,
          mb: 5,
        }}
      >
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/report"
            element={<ReportIncident />}
          />

          <Route
            path="/my-incidents"
            element={<MyIncidents />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsDashboard />}
          />

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;