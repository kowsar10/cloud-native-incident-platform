import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  MenuItem,
  TextField,
} from "@mui/material";
import API from "../services/api";

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState("");

  const fetchIncidents = async () => {
    try {
      const response = await API.get("/incidents/");
      setIncidents(response.data);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to load incidents.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/incidents/${id}`, { status });
      fetchIncidents();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to update incident.");
    }
  };

  const deleteIncident = async (id) => {
    try {
      await API.delete(`/incidents/${id}`);
      fetchIncidents();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to delete incident.");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <Box sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">
          Manage all incident reports and update their resolution status.
        </Typography>
      </Paper>

      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0f172a" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.title}</TableCell>
                <TableCell>{incident.category}</TableCell>
                <TableCell>
                  <Chip label={incident.priority} color={incident.priority === "High" ? "error" : incident.priority === "Medium" ? "warning" : "success"} />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={incident.status}
                    onChange={(e) => updateStatus(incident.id, e.target.value)}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>{incident.location || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => deleteIncident(incident.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminDashboard;