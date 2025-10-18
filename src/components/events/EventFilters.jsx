import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EventFilters = ({ filters, onFilterChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Search Events"
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="timezone">Timezone</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default EventFilters;