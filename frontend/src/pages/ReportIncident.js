import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import API from "../services/api";

function ReportIncident() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "Medium",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = ["IT Fault", "Maintenance", "Safety", "Security", "Other"];
  const priorities = ["Low", "Medium", "High"];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/incidents/", form);
      setSuccess(true);
      setMessage("Incident reported successfully.");

      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "Medium",
      });
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.detail || "Failed to report incident.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={8} sx={{ p: 5, width: "100%", maxWidth: 650, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Report an Incident
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Submit a new incident report for review and resolution.
        </Typography>

        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Incident Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {priorities.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, py: 1.3, borderRadius: 3 }}>
            Submit Incident
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ReportIncident;