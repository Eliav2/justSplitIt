import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import {
  FullSizeCenteredFlexBoxColumn,
  FullSizeMiddleFlexContainerColumn,
} from '@/components/styled';
import { useParams } from 'react-router-dom';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { useGetEvent, useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { EventDoesNotExistDialog } from '@/pages/Event/EventDoesNotExistDialog';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';

function Event() {
  const { eventId } = useParams();
  // const { event, loadingEvent, eventSnap } = useGetEvent(eventId as string);
  const event = useGetEvent(eventId as string);

  const [expenes, loadingExpenses, expensesError] = useGetEventExpenses(eventId as string);

  const eventExists = event.snap?.exists();
  const eventNotExistsDialogOpen = !event.loading && !eventExists;
  return (
    <>
      <Meta title="Event" />
      <FullSizeMiddleFlexContainerColumn>
        <QueryIndicator loading={event.loading} error={expensesError}>
          {!eventNotExistsDialogOpen ? (
            <>
              <Typography variant="h3">{event.data?.name}</Typography>

              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <QueryIndicator loading={loadingExpenses}>
                  {expenes.map((expene, expenseIndex) => {
                    return <ExpenseListItem expenseId={expene.id} key={expene.id} />;
                  })}
                </QueryIndicator>
              </List>
              {event.data && <NewExpenseDialog parentEvent={event.data} />}
            </>
          ) : (
            <EventDoesNotExistDialog open={eventNotExistsDialogOpen} />
          )}
        </QueryIndicator>
      </FullSizeMiddleFlexContainerColumn>
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
