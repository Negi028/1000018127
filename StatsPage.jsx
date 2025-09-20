import React, { useState, useEffect } from "react";
import { listMappings, getClicks } from "../utils/storage";
import { Paper, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

export default function StatsPage() {
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    setMappings(listMappings());
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Shortened URLs - Statistics</Typography>
      {mappings.length === 0 && <Typography>No shortened URLs found.</Typography>}
      <List>
        {mappings.map((m) => {
          const clicks = getClicks(m.shortcode);
          return (
            <ListItem key={m.shortcode} sx={{ mb: 1 }}>
              <Paper sx={{ p: 2, width: "100%" }}>
                <Typography><strong>Short:</strong> {window.location.origin}/{m.shortcode}</Typography>
                <Typography><strong>Original:</strong> {m.longUrl}</Typography>
                <Typography>
                  <strong>Created:</strong> {new Date(m.createdAt).toLocaleString()} <strong>Expires:</strong> {new Date(m.expiresAt).toLocaleString()}
                </Typography>
                <Typography><strong>Total Clicks:</strong> {clicks.length}</Typography>
                {clicks.length > 0 && (
                  <>
                    <Typography sx={{ mt: 1 }}>Click details:</Typography>
                    <List dense>
                      {clicks.slice().reverse().map((c, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={`${new Date(c.ts).toLocaleString()} — ref: ${c.referrer || "direct"}`} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
