import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Container } from '@mui/material';
import { Logger } from '../utils/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const allLinks = JSON.parse(localStorage.getItem('shortLinks')) || [];
    const link = allLinks.find(l => l.shortcode === shortcode);

    if (!link) {
      setStatus('not_found');
      return;
    }

    const now = Date.now();
    if (now > link.expiresAt) {
      setStatus('expired');
      return;
    }

    // Update click stats
    const updatedLinks = allLinks.map(l => {
      if (l.shortcode === shortcode) {
        l.clicks.push({
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'Direct',
          location: 'Unknown' // Or integrate with IP-based geo API
        });
        Logger.log('Short link accessed', { shortcode, timestamp: new Date().toISOString() });
      }
      return l;
    });

    localStorage.setItem('shortLinks', JSON.stringify(updatedLinks));

    // Delay to show status message before redirect
    setTimeout(() => {
      window.location.href = link.longUrl;
    }, 1500);

    setStatus('redirecting');
  }, [shortcode]);

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      {status === 'checking' || status === 'redirecting' ? (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Redirecting...
          </Typography>
        </>
      ) : status === 'not_found' ? (
        <Typography variant="h5" color="error">Shortcode not found.</Typography>
      ) : (
        <Typography variant="h5" color="error">This link has expired.</Typography>
      )}
    </Container>
  );
};

export default RedirectHandler;
