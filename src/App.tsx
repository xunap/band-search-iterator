import { useState } from 'react';
import { Box, Card, Paper, TextField, Typography } from '@mui/material';
import { useInterval } from './hooks/useInterval';
import './App.css';

const App = () => {
  const alphabetItems = ['A', 'B', 'C', 'D', 'E'];

  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(alphabetItems);

  useInterval(() => {
    setItems((prevItems) => {
      let newItems = [...prevItems];
      if (newItems.length > 5) {
        newItems.shift();
      } else {
        const shifted = newItems.shift()!;
        newItems.push(shifted);
      }
      return newItems;
    });
  }, 1000);

  const fetchAlbums = async () => {
    if (searchTerm === '') {
      setItems((prevItems) => [...prevItems.slice(0, 5), ...alphabetItems]);
    } else {
      const response = await fetch(`https://itunes.apple.com/search?media=music&country=US&term=${searchTerm}`);
      const data = await response.json();
      const albumsFromResponse: string[] = data.results.map((song: { collectionName: string }) => song.collectionName);
      const uniqueAlbums = [...new Set(albumsFromResponse)].sort((a, b) => a.localeCompare(b)).slice(0, 5);
      setItems((prevItems) => {
        return [...prevItems.slice(0, 5), ...uniqueAlbums];
      });
    }
  };

  return (
    <Box sx={{ width: 800, margin: 'auto', p: 2 }}>
      <TextField
        value={searchTerm}
        placeholder="Search Band (press Enter)..."
        fullWidth
        sx={{
          mb: 1,
          height: '56px',
          '&.MuiFormControl-root': {
            border: '2px solid grey',
            borderRadius: '8px',
          },
          '& input': {
            fontSize: '24px',
            py: '11px',
          },
        }}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && fetchAlbums()}
      />
      <Paper
        sx={{
          px: '2px',
          py: '1px',
          bgcolor: 'lightgrey',
          border: '2px solid grey',
        }}
      >
        {items.slice(0, 5).map((item, i) => (
          <Card
            key={i}
            sx={{
              margin: 1,
              borderRadius: 2,
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid grey',
            }}
          >
            <Typography variant="h5">{item}</Typography>
          </Card>
        ))}
      </Paper>
    </Box>
  );
};

export default App;
