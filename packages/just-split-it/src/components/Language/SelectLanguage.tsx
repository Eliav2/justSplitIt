import { useState } from 'react';
import useLanguage, { LanguageMode } from '@/store/theme/useThemeLanguage';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import TranslateIcon from '@mui/icons-material/Translate';

export const SelectLanguage = () => {
  const [appLanguage, { setLanguage }] = useLanguage();

  const handleChange = (event: SelectChangeEvent) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage as LanguageMode);
  };
  // console.log('appLanguage', appLanguage);

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel>Language</InputLabel>
        <Select
          value={appLanguage}
          label="Language"
          onChange={handleChange}
          startAdornment={<TranslateIcon sx={{ mr: 1 }} />}
        >
          {Object.values(LanguageMode).map((language) => (
            <MenuItem value={language} key={language}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
