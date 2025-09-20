import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Box } from "@mui/material";
import { generateShortcode, isValidHttpUrl, isShortcodeValid, nowMs } from "../utils/helpers";
import { addMapping, getMapping } from "../utils/storage";
import Log from "../Log";

const DEFAULT_VALIDITY_MIN = 30;

function ShortenerRow({ idx, values, setValues, onRemove }) {
  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            label={`Long URL #${idx + 1}`}
            value={values.longUrl}
            onChange={(e) => setValues({ ...values, longUrl: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Validity (minutes)"
            value={values.validity}
            onChange={(e) => setValues({ ...values, validity: e.target.value })}
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Preferred shortcode"
            value={values.shortcode}
            onChange={(e) => setValues({ ...values, shortcode: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="error" onClick={onRemove} size="small">Remove</Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function ShortenerPage() {
  const [rows, setRows] = useState([{ longUrl: "", validity: DEFAULT_VALIDITY_MIN, shortcode: "" }]);
  const [results, setResults] = useState([]);

  const addRow = () => {
    if (rows.length >= 5) return;
    setRows([...rows, { longUrl: "", validity: DEFAULT_VALIDITY_MIN, shortcode: "" }]);
  };

  const removeRow = (i) => {
    const copy = [...rows];
    copy.splice(i, 1);
    setRows(copy);
  };

  const submit = async () => {
    const created = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!isValidHttpUrl(r.longUrl)) {
        await Log("ShortenerPage", "warn", "Shortener", `Invalid URL ${r.longUrl}`);
        alert(`Row ${i + 1}: Invalid URL`);
        continue;
      }
      const validity = parseInt(r.validity || DEFAULT_VALIDITY_MIN, 10) || DEFAULT_VALIDITY_MIN;
      if (validity <= 0) {
        alert(`Row ${i + 1}: Validity must be positive`);
        continue;
      }
      let code = (r.shortcode || "").trim();
      if (code) {
        if (!isShortcodeValid(code)) {
          alert(`Row ${i + 1}: Shortcode invalid`);
          continue;
        }
        if (getMapping(code)) {
          await Log("ShortenerPage", "error", "Shortener", `Collision ${code}`);
          alert(`Row ${i + 1}: Shortcode already in use`);
          continue;
        }
      } else {
        let attempts = 0;
        do {
          code = generateShortcode(6);
          attempts++;
        } while (getMapping(code) && attempts < 10);
        if (getMapping(code)) code = code + "-" + Date.now().toString(36).slice(-4);
      }
      const createdAt = nowMs();
      const expiresAt = createdAt + validity * 60 * 1000;
      const mapping = { longUrl: r.longUrl.trim(), shortcode: code, createdAt, expiresAt };
      addMapping(mapping);
      created.push(mapping);
      await Log("ShortenerPage", "info", "Shortener", `Created ${code}`);
    }
    setResults(created);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {rows.map((row, i) => (
        <ShortenerRow
          key={i}
          idx={i}
          values={row}
          setValues={(val) => {
            const copy = [...rows];
            copy[i] = val;
            setRows(copy);
          }}
          onRemove={() => removeRow(i)}
        />
      ))}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={addRow} disabled={rows.length >= 5} sx={{ mr: 1 }}>Add URL</Button>
        <Button variant="contained" color="primary" onClick={submit}>Shorten</Button>
      </Box>
      <Box>
        <Typography variant="h6">Results</Typography>
        {results.length === 0 && <Typography>No results yet.</Typography>}
        {results.map((r) => (
          <Paper key={r.shortcode} sx={{ p: 2, mb: 1 }}>
            <Typography><strong>Short:</strong> {window.location.origin}/{r.shortcode}</Typography>
            <Typography><strong>Original:</strong> {r.longUrl}</Typography>
            <Typography><strong>Expires:</strong> {new Date(r.expiresAt).toLocaleString()}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
