import type {
  FirestoreExpenseWithId,
  FirestoreUserWithId,
} from '@/utils/firebase/firestore/schema';
import { v4 as uuid } from 'uuid';

import { splitByCondition } from '@/utils/general';

class Debt {
  public expense: FirestoreExpenseWithId;
  public amount: number;
  public oweTo: ParticipantNode;
  public owedBy: ParticipantNode;
  public simplified: false | [Debt, Debt];
  public id: string;

  constructor(
    expense: FirestoreExpenseWithId,
    amount: number,
    owedBy: ParticipantNode,
    oweTo: ParticipantNode,
  ) {
    this.expense = expense;
    this.amount = amount;
    this.oweTo = oweTo;
    this.owedBy = owedBy;
    this.simplified = false;
    // this.id = this.expense.id + this.owedBy.participant.id + this.oweTo.participant.id;
    this.id = uuid();
  }

  toString() {
    return `${this.owedBy.participant.name}=>${this.oweTo.participant.name}: ${this.amount}`;
  }
}

class ParticipantNode {
  public participant: FirestoreUserWithId;
  public relatedDebts: Debt[];

  constructor(user: FirestoreUserWithId) {
    this.participant = user;
    this.relatedDebts = [];
  }
}

class EventGraph {
  private participants: Map<string, ParticipantNode>; // Mapping user ID to ParticipantNode
  public allDebts: Debt[];

  constructor(
    participants: FirestoreUserWithId[] | undefined,
    private expenses: FirestoreExpenseWithId[] | undefined,
  ) {
    this.participants = new Map();
    this.allDebts = [];

    if (!participants || !expenses) return;
    for (const participant of participants) {
      this.participants.set(participant.id, new ParticipantNode(participant));
    }

    for (const expense of expenses) {
      const payerNode = this.participants.get(expense.payerId);
      if (!payerNode) {
        continue;
      }

      const amountPerParticipant = expense.amount / expense.participantsIds.length;

      for (const participantId of expense.participantsIds) {
        if (participantId !== expense.payerId) {
          const participantNode = this.participants.get(participantId);
          if (participantNode) {
            const debt = new Debt(expense, amountPerParticipant, participantNode, payerNode);
            payerNode.relatedDebts.push(debt);
            this.participants.get(participantId)?.relatedDebts.push(debt);
            this.allDebts.push(debt);
          }
        }
      }
    }
  }

  getDebtsForUser(userId: string): Debt[] {
    const userNode = this.participants.get(userId);
    return userNode ? userNode.relatedDebts : [];
  }

  getSimplifiedDebts(): Debt[] {
    const debtsToSimplify: Map<string, Debt> = structuredClone(
      new Map(this.allDebts.map((d) => [d.id, d])),
    );

    const findDebtToSimplify = () => {
      const debtsMap: {
        [participantId: string]: {
          owes: Debt[];
          owned: Debt[];
        };
      } = {};
      for (const [id, debt] of debtsToSimplify) {
        for (const [id, participantNode] of this.participants) {
          const participantId = participantNode.participant.id;
          if (!debtsMap[participantId]) {
            debtsMap[participantId] = {
              owes: [],
              owned: [],
            };
          }
          if (participantId === debt.owedBy.participant.id) {
            debtsMap[participantId].owes.push(debt);
          }
          if (participantId === debt.oweTo.participant.id) {
            debtsMap[participantId].owned.push(debt);
          }
          if (debtsMap[participantId].owned.length > 0 && debtsMap[participantId].owes.length > 0)
            return [debtsMap[participantId].owned[0], debtsMap[participantId].owes[0]] as const;
        }
      }
      return false;
    };

    let toSimplify = findDebtToSimplify();
    while (toSimplify) {
      const [owned, owes] = toSimplify;
      const An = owned.owedBy;
      const Bn = owned.oweTo;
      const Cn = owes.oweTo;
      if (owned.amount > owes.amount) {
        const ACDebt = new Debt(owes.expense, owes.amount, An, Cn);
        const ABDebt = new Debt(owned.expense, owned.amount - owes.amount, An, Bn);
        debtsToSimplify.set(ACDebt.id, ACDebt);
        debtsToSimplify.set(ABDebt.id, ABDebt);
      } else if (owned.amount < owes.amount) {
        const ACDebt = new Debt(owned.expense, owned.amount, An, Cn);
        const BCDebt = new Debt(owes.expense, owes.amount - owned.amount, Bn, Cn);
        debtsToSimplify.set(ACDebt.id, ACDebt);
        debtsToSimplify.set(BCDebt.id, BCDebt);
      } else {
        const ACDebt = new Debt(owned.expense, owned.amount, An, Cn);
        debtsToSimplify.set(ACDebt.id, ACDebt);
      }
      debtsToSimplify.delete(owned.id);
      debtsToSimplify.delete(owes.id);

      toSimplify = findDebtToSimplify();
    }

    // combine debts from the same participant into the same participant
    const combineDebts = () => {
      const debtsMap: {
        [participantId: string]: Debt[];
      } = {};
      for (const [, debt] of debtsToSimplify) {
        const debtsId = `${debt.owedBy.participant.name}=>${debt.oweTo.participant.name}`;
        if (!debtsMap[debtsId]) {
          debtsMap[debtsId] = [];
        }
        debtsMap[debtsId].push(debt);
      }
      for (const [, debts] of Object.entries(debtsMap)) {
        if (debts.length > 1) {
          const combinedDebt = debts.reduce((acc, debt) => {
            return new Debt(debt.expense, acc.amount + debt.amount, debt.owedBy, debt.oweTo);
          });
          debtsToSimplify.set(combinedDebt.id, combinedDebt);
          for (const debt of debts) {
            debtsToSimplify.delete(debt.id);
          }
        }
      }
    };
    combineDebts();

    return [...debtsToSimplify.values()];
  }
}

export default EventGraph;
