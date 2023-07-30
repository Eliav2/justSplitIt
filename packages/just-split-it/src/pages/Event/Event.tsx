import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import {
  useExpense,
  useGetEvent,
  useGetEventExpenses,
} from '@/utils/firebase/firestore/queris/hooks';
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
import { useGrabDocumentsById } from '@/utils/firebase/firestore/hooks/query';
import { firestore } from '@/utils/firebase/firestore/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';

interface ExpenseProps {
  expenseId: string;
}

const ExpenseListItem = (props: ExpenseProps) => {
  const [expene, loading] = useExpense(props.expenseId);
  const [user] = useAuthState(fbAuth);

  function handleToggle(name: string) {
    return undefined;
  }

  const includedInExpense = expene?.participantsIds.includes(user!.uid);

  return (
    <QueryIndicator loading={loading}>
      {expene && (
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
                // checked={checked[expene.name]?.selected}
                checked={includedInExpense}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={expene.id} primary={`Expense: ${expene.name}`} />
          </ListItemButton>
        </ListItem>
      )}
    </QueryIndicator>
  );
};

function Event() {
  const { eventId } = useParams();
  const [event, loadingEvent, eventSnap] = useGetEvent(eventId as string);
  const [expenes, loadingExpenses] = useGetEventExpenses(eventId as string);
  // const participants = useGrabDocumentsById(firestore.user(), props.parentEvent?.participantsIds);

  // todo: create event if not exists
  // console.log(eventSnap?.exists());
  const [checked, setChecked] = useState<{
    [key: string]: { selected: boolean };
  }>(() =>
    expenes
      .map((expene) => ({ [expene.name]: { selected: false } }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  );

  const handleToggle = (expenseName: string) => () => {
    setChecked((prev) => ({ ...prev, [expenseName]: { selected: !prev[expenseName]?.selected } }));
  };

  console.log(eventSnap);

  return (
    <>
      <Meta title="Event" />
      <FullSizeCenteredFlexBoxColumn>
        <QueryIndicator loading={loadingEvent}>
          <Typography variant="h3">{event?.name}</Typography>

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <QueryIndicator loading={loadingExpenses}>
              {expenes.map((expene, expenseIndex) => {
                return <ExpenseListItem expenseId={expene.id} />;
                // return (
                //   <ListItem
                //     key={expene.id}
                //     secondaryAction={
                //       <IconButton edge="end" aria-label="comments">
                //         <CommentIcon />
                //       </IconButton>
                //     }
                //     disablePadding
                //   >
                //     <ListItemButton role={undefined} onClick={handleToggle(expene.name)} dense>
                //       <ListItemIcon>
                //         <Checkbox
                //           edge="start"
                //           // checked={checked[expene.name]?.selected}
                //           checked={}
                //           tabIndex={-1}
                //           disableRipple
                //         />
                //       </ListItemIcon>
                //       <ListItemText id={expene.id} primary={`Expense: ${expene.name}`} />
                //     </ListItemButton>
                //   </ListItem>
                // );
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
        </QueryIndicator>
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
