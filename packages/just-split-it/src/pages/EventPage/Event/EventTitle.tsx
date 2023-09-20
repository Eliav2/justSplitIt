import { FirestoreEvent, FirestoreEventWithId } from '@/utils/firebase/firestore/schema';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { EditEventDialogButton } from '@/pages/EventPage/EditEventDialogButton';
import Box from '@mui/material/Box';

export const EventTitle = ({ eventData }: { eventData: FirestoreEventWithId }) => {
  return (
    <>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="h4" sx={{ m: 1, mb: 2 }}>
            {eventData?.name}
          </Typography>
          <Box style={{ marginInlineStart: 'auto' }}>
            <EditEventDialogButton event={eventData} />
          </Box>
        </Stack>
        <Typography variant="body2" sx={{ mx: 1, mb: 2 }}>
          {eventData?.description}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};
