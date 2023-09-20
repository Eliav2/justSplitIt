import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

export const EventTitle = ({ eventData }: { eventData: FirestoreEvent }) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems={'center'}>
        <Typography variant="h4" sx={{ m: 1, mb: 2 }}>
          {eventData?.name}
        </Typography>
        <Stack>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};
