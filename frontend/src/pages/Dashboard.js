import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState("");

  const fetchIncidents = async () => {
    try {
      const response = await API.get("/incidents/");
      setIncidents(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to load dashboard.");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const total = incidents.length;
  const open = incidents.filter((i) => i.status === "Open").length;
  const resolved = incidents.filter((i) => i.status === "Resolved").length;
  const highPriority = incidents.filter((i) => i.priority === "High").length;

  const recentIncidents = incidents.slice(0, 5);

  return (
    <Box sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Overview of incident activity and quick actions.
        </Typography>
      </Paper>

      {message && <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Total Incidents</Typography>
              <Typography variant="h3" fontWeight="bold">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Open</Typography>
              <Typography variant="h3" fontWeight="bold">{open}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Resolved</Typography>
              <Typography variant="h3" fontWeight="bold">{resolved}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">High Priority</Typography>
              <Typography variant="h3" fontWeight="bold">{highPriority}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recent Incidents
            </Typography>

            {recentIncidents.length === 0 ? (
              <Alert severity="info">No recent incidents found.</Alert>
            ) : (
              <List>
                {recentIncidents.map((incident, index) => (
                  <React.Fragment key={incident.id}>
                    <ListItem>
                      <ListItemText
                        primary={incident.title}
                        secondary={`${incident.category} • ${incident.location || "No location"}`}
                      />
                      <Chip label={incident.priority} color={incident.priority === "High" ? "error" : incident.priority === "Medium" ? "warning" : "success"} sx={{ mr: 1 }} />
                      <Chip label={incident.status} variant="outlined" />
                    </ListItem>
                    {index < recentIncidents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>

            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/report"
              sx={{ mb: 2, borderRadius: 3 }}
            >
              Report New Incident
            </Button>

            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/my-incidents"
              sx={{ mb: 2, borderRadius: 3 }}
            >
              View My Incidents
            </Button>

            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/analytics"
              sx={{ borderRadius: 3 }}
            >
              View Analytics
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;