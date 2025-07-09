import { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StatisticsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem('shortLinks')) || [];
    setData(links);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Shortened URL Statistics</Typography>
      {data.length === 0 ? (
        <Typography>No shortened links found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, i) => (
              <TableRow key={i}>
                <TableCell>
                  <a href={`/${entry.shortcode}`} target="_blank">
                    {window.location.origin}/{entry.shortcode}
                  </a>
                </TableCell>
                <TableCell>{entry.longUrl}</TableCell>
                <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(entry.expiresAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {entry.clicks.length} clicks
                    </AccordionSummary>
                    <AccordionDetails>
                      {entry.clicks.map((click, idx) => (
                        <Typography key={idx} sx={{ mb: 1 }}>
                          {new Date(click.timestamp).toLocaleString()} — {click.referrer} — {click.location}
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default StatisticsPage;
