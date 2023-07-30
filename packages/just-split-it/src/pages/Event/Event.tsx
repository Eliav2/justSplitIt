import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent, useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import CommentIcon from '@mui/icons-material/Comment';
import { useState } from 'react';
import QueryIndicator from '@/components/QueryIndicator';

function Event() {
  const { eventId } = useParams();
  const event = useGetEvent(eventId as string);
  const [expenes, loading] = useGetEventExpenses(eventId as string);

  const [checked, setChecked] = useState<{
    [key: string]: { selected: boolean };
  }>(() =>
    expenes
      .map((expene) => ({ [expene.name]: { selected: false } }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  );
  console.log(checked);

  const handleToggle = (expenseName: string) => () => {
    setChecked((prev) => ({ ...prev, [expenseName]: { selected: !prev[expenseName]?.selected } }));
  };

  return (
    <>
      <Meta title="Event" />
      <FullSizeCenteredFlexBoxColumn>
        <Typography variant="h3">{event?.name}</Typography>

        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <QueryIndicator loading={loading}>
            {expenes.map((expene) => {
              return (
                <ListItem
                  key={expene.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <CommentIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(expene.name)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked[expene.name]?.selected}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText id={expene.id} primary={`Expense: ${expene.name}`} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </QueryIndicator>
        </List>

        {/*<CheckboxList />*/}

        {/*<List sx={{ width: 250 }}>*/}
        {/*  {expenes.map(({ name, amount, payerName }) => (*/}
        {/*    <ListItem sx={{ p: 0 }} key={path}>*/}
        {/*      <ListItemButton component={Link} to={path as string} onClick={sidebarActions.close}>*/}
        {/*        <ListItemIcon>{Icon ? <Icon /> : <DefaultIcon />}</ListItemIcon>*/}
        {/*        <ListItemText>{title}</ListItemText>*/}
        {/*      </ListItemButton>*/}
        {/*    </ListItem>*/}
        {/*  ))}*/}
        {/*</List>*/}

        {event && <NewExpenseDialog parentEvent={event} />}
      </FullSizeCenteredFlexBoxColumn>
    </>
  );
}

export default Event;

//
// import * as React from 'react';
//
// function CheckboxList() {
//
//     return (
//
//     );
// }
