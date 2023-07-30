import { useExpense } from '@/utils/firebase/firestore/queris/hooks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import QueryIndicator from '@/components/QueryIndicator';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

interface ExpenseProps {
  expenseId: string;
}

export const ExpenseListItem = (props: ExpenseProps) => {
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
