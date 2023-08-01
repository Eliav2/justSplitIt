import { DocumentSnapshot } from 'firebase/firestore';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { useGetEventExpenses } from '@/utils/firebase/firestore/queris/hooks';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import QueryIndicator from '@/components/QueryIndicator';
import { ExpenseListItem } from '@/pages/Event/ExpenseListItem';
import { NewExpenseDialog } from '@/pages/Event/NewExpenseDialog';
import { DeleteEventDialogButton } from '@/components/Dialog/DeleteEventDialogButton';
import Button from '@mui/material/Button';
import ParticipantLeaveEventDialogButton from '@/components/Dialog/ParticipantLeaveEventDialogButton';

interface ExpensesDetailsProps {
  event: DocumentSnapshot<FirestoreEvent>;
}

const ExpensesDetails = ({ event }: ExpensesDetailsProps) => {
  const [user] = useAuthState(fbAuth);
  const [expenses, loading, error] = useGetEventExpenses(event.id as string, event);
  const expensesData = expenses?.docs.map((expense) => expense.data());
  const eventData = event && Object.assign({}, event.data(), { id: event.id });

  const eventTotalExpense = expensesData?.reduce((acc, expense) => acc + expense.amount, 0);
  const isOwner = user?.uid === eventData?.ownerId;

  return (
    <>
      <Typography variant="h3">{eventData?.name}</Typography>

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <QueryIndicator loading={loading} errorMessage={error?.message}>
          {expenses?.docs.map((expene, expenseIndex) => {
            return <ExpenseListItem expenseId={expene.id} key={expene.id} />;
          })}
        </QueryIndicator>
      </List>
      <NewExpenseDialog parentEvent={eventData} />
      {isOwner ? (
        <DeleteEventDialogButton
          event={eventData}
          buttonElement={(handleOpen) => (
            <Button onClick={handleOpen} color={'warning'}>
              Delete Event
            </Button>
          )}
        />
      ) : (
        <ParticipantLeaveEventDialogButton eventId={event.id} />
      )}
    </>
  );
};
export default ExpensesDetails;
