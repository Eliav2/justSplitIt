import { FirestoreExpense } from '@/utils/firebase/firestore/schema';
import { useParticipantsInExpense } from '@/utils/firebase/firestore/queris/get';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, ListItemAvatar } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { useEventContext } from '@/pages/EventPage/EventContext';
import English from '@/components/Language/English';
import Hebrew from '@/components/Language/Hebrew';

interface ExpenseParticipantsDetailsProps {
  expense: FirestoreExpense;
}

export const ExpenseParticipantsDetails = (props: ExpenseParticipantsDetailsProps) => {
  const [participantsInExpense] = useParticipantsInExpense(props.expense);
  const event = useEventContext();
  // const userIdsParticipatingInEvent = props.expense.participantsIds;
  // const userIdsNotParticipatingInEvent = event?.participantsIds.filter(
  //   (id) => !userIdsParticipatingInEvent.includes(id),
  // );

  return (
    <DialogContent>
      <English>Participants</English>
      <Hebrew>משתתפים</Hebrew>
      <List dense>
        {participantsInExpense?.map((p) => {
          const isPayer = props.expense.payerId == p.id;
          const extraProp = isPayer
            ? {
                secondary: (
                  <>
                    <English>Payed for this expense</English>
                    <Hebrew>שילם על הוצאה זו</Hebrew>
                  </>
                ),
              }
            : {};
          return (
            <ListItem key={p.id}>
              <ListItemAvatar>
                {/*<Avatar>*/}
                <CheckIcon />
                {/*</Avatar>*/}
              </ListItemAvatar>
              <ListItemText primary={p.name} {...extraProp} />
            </ListItem>
          );
        })}
      </List>
    </DialogContent>
  );
};
