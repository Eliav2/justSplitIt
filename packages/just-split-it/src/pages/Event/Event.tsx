import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBoxColumn } from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent, useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/Event/EventDoesNotExistDialog';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';

function Event() {
  const { eventId } = useParams();
  const [event, loadingEvent, eventSnap] = useGetEvent(eventId as string);
  const [expenes, loadingExpenses] = useGetEventExpenses(eventId as string);

  // const [checked, setChecked] = useState<{
  //   [key: string]: { selected: boolean };
  // }>(() =>
  //   expenes
  //     .map((expene) => ({ [expene.name]: { selected: false } }))
  //     .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  // );
  //
  // const handleToggle = (expenseName: string) => () => {
  //   setChecked((prev) => ({ ...prev, [expenseName]: { selected: !prev[expenseName]?.selected } }));
  // };

  // console.log(eventSnap);

  const eventNotExistsDialogOpen = loadingEvent && !eventSnap?.exists();

  return (
    <>
      <Meta title="Event" />
      <FullSizeCenteredFlexBoxColumn>
        <QueryIndicator loading={loadingEvent}>
          {!eventNotExistsDialogOpen ? (
            <>
              <Typography variant="h3">{event!.name}</Typography>

              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <QueryIndicator loading={loadingExpenses}>
                  {expenes.map((expene, expenseIndex) => {
                    return <ExpenseListItem expenseId={expene.id} key={expene.id} />;
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
            </>
          ) : (
            <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
          )}
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
