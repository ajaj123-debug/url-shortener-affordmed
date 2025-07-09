import { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Snackbar } from '@mui/material';
import { Logger } from '../utils/logger';

function ShortenerPage() {
  const [urls, setUrls] = useState([{ longUrl: '', shortcode: '', validity: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', shortcode: '', validity: '' }]);
    }
  };

  const generateShortcode = () => Math.random().toString(36).substr(2, 5);

  const handleSubmit = () => {
    const shortLinks = [];
    for (let entry of urls) {
      try {
        // Validations
        if (!entry.longUrl.match(/^https?:\/\/.+/)) throw new Error('Invalid URL');
        const shortcode = entry.shortcode || generateShortcode();
        const validity = parseInt(entry.validity || '30');
        if (isNaN(validity)) throw new Error('Invalid validity');

        const existing = JSON.parse(localStorage.getItem('shortLinks')) || [];
        if (existing.find(item => item.shortcode === shortcode)) throw new Error('Shortcode already exists');

        const now = Date.now();
        const newEntry = {
          longUrl: entry.longUrl,
          shortcode,
          createdAt: now,
          expiresAt: now + validity * 60000,
          clicks: []
        };

        existing.push(newEntry);
        localStorage.setItem('shortLinks', JSON.stringify(existing));
        Logger.log('Shortened URL created', newEntry);
        shortLinks.push(newEntry);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    setResults(shortLinks);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {urls.map((entry, idx) => (
        <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
          <Grid item xs={5}>
            <TextField fullWidth label="Long URL" value={entry.longUrl}
              onChange={e => handleChange(idx, 'longUrl', e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth label="Desired Code (optional)" value={entry.shortcode}
              onChange={e => handleChange(idx, 'shortcode', e.target.value)} />
          </Grid>
          <Grid item xs={2}>
            <TextField fullWidth label="Validity (in min only)" value={entry.validity}
              onChange={e => handleChange(idx, 'validity', e.target.value)} />
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" onClick={addRow} disabled={urls.length >= 5}>+ Add Row</Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleSubmit}>Shorten</Button>

      <Typography variant="h6" sx={{ mt: 4 }}>Shortened URLs</Typography>
      {results.map((r, i) => (
        <Typography key={i}>
          <a href={`${window.location.origin}/${r.shortcode}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{r.shortcode}</a>
        </Typography>
      ))}

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
}

export default ShortenerPage;
