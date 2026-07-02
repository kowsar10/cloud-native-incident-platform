import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import API from "../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AnalyticsDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState("");

  const fetchIncidents = async () => {
    try {
      const response = await API.get("/incidents/");
      setIncidents(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to load analytics.");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const total = incidents.length;
  const open = incidents.filter((i) => i.status === "Open").length;
  const resolved = incidents.filter((i) => i.status === "Resolved").length;
  const highPriority = incidents.filter((i) => i.priority === "High").length;

  const categoryCounts = incidents.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts = incidents.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Incidents by Category",
        data: Object.values(categoryCounts),
      },
    ],
  };

  const priorityData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        label: "Incidents by Priority",
        data: Object.values(priorityCounts),
      },
    ],
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        <Typography color="text.secondary">
          Monitor incident trends, workload, priority levels, and service status.
        </Typography>
      </Paper>

      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Total Incidents</Typography>
              <Typography variant="h3" fontWeight="bold">
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Open</Typography>
              <Typography variant="h3" fontWeight="bold">
                {open}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">Resolved</Typography>
              <Typography variant="h3" fontWeight="bold">
                {resolved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={5} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">High Priority</Typography>
              <Typography variant="h3" fontWeight="bold">
                {highPriority}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Incidents by Category
            </Typography>
            <Pie data={categoryData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Incidents by Priority
            </Typography>
            <Bar data={priorityData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsDashboard;