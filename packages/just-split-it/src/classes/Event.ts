import type {
  FirestoreExpenseWithId,
  FirestoreUserWithId,
} from '@/utils/firebase/firestore/schema';
import type { Debt } from '@/pages/EventPage/Event/Event';

class Event {
  public debts: Debt[];
  constructor(
    public participants: FirestoreUserWithId[],
    private expenses: FirestoreExpenseWithId[],
  ) {
    const eventsDebts: Debt[] = [];
    for (const expense of expenses) {
      for (const participant of participants) {
        if (expense.payerId === participant.id) {
          continue;
        }
        if (expense.participantsIds.includes(participant.id)) {
          const debt = {
            expenseName: expense.name,
            amount: expense.amount / expense.participantsIds.length,
            participantName: participant.name,
            oweTo: expense.payerName,
            simplified: false,
          } satisfies Debt;
          eventsDebts.push(debt);
        }
      }
    }
    this.debts = eventsDebts;
  }
}

export default Event;
