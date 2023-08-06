import { useState } from 'react';
import useLanguage from '@/store/theme/useThemeLanguage';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import TranslateIcon from '@mui/icons-material/Translate';
import { LanguageMode } from '@/components/Language/index';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

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
        <InputLabel>
          <English>Language</English>
          <Hebrew>שפה</Hebrew>
        </InputLabel>
        <Select
          value={appLanguage}
          label={
            <>
              <English>Language</English>
              <Hebrew>שפה</Hebrew>
            </>
          }
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
