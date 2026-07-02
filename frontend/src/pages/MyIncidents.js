import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import API from "../services/api";

function MyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  const fetchIncidents = async () => {
    try {
      const response = await API.get("/incidents/");
      setIncidents(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to load incidents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <Box sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          My Incidents
        </Typography>
        <Typography color="text.secondary">
          View and track your submitted incident reports.
        </Typography>
      </Paper>

      {message && <Alert severity="error">{message}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : incidents.length === 0 ? (
        <Alert severity="info">No incidents found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {incidents.map((incident) => (
            <Grid item xs={12} md={6} lg={4} key={incident.id}>
              <Card elevation={5} sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {incident.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {incident.description}
                  </Typography>

                  <Chip
                    label={incident.category}
                    sx={{ mr: 1, mb: 1 }}
                    color="primary"
                  />

                  <Chip
                    label={incident.priority}
                    sx={{ mr: 1, mb: 1 }}
                    color={getPriorityColor(incident.priority)}
                  />

                  <Chip
                    label={incident.status}
                    sx={{ mb: 1 }}
                    variant="outlined"
                  />

                  <Typography sx={{ mt: 2 }} variant="body2">
                    Location: {incident.location || "Not specified"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Created: {incident.created_at}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default MyIncidents;