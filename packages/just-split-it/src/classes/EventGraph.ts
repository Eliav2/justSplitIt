import type {
  FirestoreExpenseWithId,
  FirestoreUserWithId,
} from '@/utils/firebase/firestore/schema';

class Debt {
  public expense: FirestoreExpenseWithId;
  public amount: number;
  public oweTo: GraphNode;
  public owedBy: GraphNode;
  public simplified: false | [Debt, Debt];

  constructor(
    expense: FirestoreExpenseWithId,
    amount: number,
    oweTo: GraphNode,
    owedBy: GraphNode,
  ) {
    this.expense = expense;
    this.amount = amount;
    this.oweTo = oweTo;
    this.owedBy = owedBy;
    this.simplified = false;
  }
}
class GraphNode {
  public user: FirestoreUserWithId;
  public debts: Debt[];

  constructor(user: FirestoreUserWithId) {
    this.user = user;
    this.debts = [];
  }
}

class EventGraph {
  private nodes: Map<string, GraphNode>; // Mapping user ID to GraphNode
  public allDebts: Debt[];

  constructor(
    private participants: FirestoreUserWithId[] | undefined,
    private expenses: FirestoreExpenseWithId[] | undefined,
  ) {
    this.nodes = new Map();
    this.allDebts = [];

    if (!participants || !expenses) return;
    for (const participant of participants) {
      this.nodes.set(participant.id, new GraphNode(participant));
    }

    for (const expense of expenses) {
      const payerNode = this.nodes.get(expense.payerId);
      if (!payerNode) {
        continue;
      }

      const amountPerParticipant = expense.amount / expense.participantsIds.length;

      for (const participantId of expense.participantsIds) {
        if (participantId !== expense.payerId) {
          const participantNode = this.nodes.get(participantId);
          if (participantNode) {
            const debt = new Debt(expense, amountPerParticipant, payerNode, participantNode);
            payerNode.debts.push(debt);
            this.allDebts.push(debt);
          }
        }
      }
    }
  }

  getDebtsForUser(userId: string): Debt[] {
    const userNode = this.nodes.get(userId);
    return userNode ? userNode.debts : [];
  }

  getSimplifiedDebts(): Debt[] {
    const simplifiedDebts: Debt[] = [];
    // const allDebts: Debt[] = [];

    // // Create a copy of debts to work with
    // for (const node of this.nodes.values()) {
    //   allDebts.push(...node.debts);
    // }

    let simplifiedCount = 0;

    do {
      simplifiedCount = 0;

      for (const debt of this.allDebts) {
        const simplifiedDebt = this.findSimplifiedDebt(debt, this.allDebts);
        if (simplifiedDebt) {
          simplifiedCount++;
          simplifiedDebts.push(simplifiedDebt);

          // Mark the debts as simplified
          debt.simplified = [debt, simplifiedDebt];
          simplifiedDebt.simplified = [debt, simplifiedDebt];
        }
      }
    } while (simplifiedCount > 0);

    return this.allDebts.filter((debt) => !debt.simplified);
  }

  private findSimplifiedDebt(targetDebt: Debt, allDebts: Debt[]): Debt | undefined {
    // Find debts where the current debt owes to the same participant that owes to the current debt
    const potentialSimplifiedDebts = allDebts.filter(
      (debt) => debt.oweTo === targetDebt.owedBy && debt.owedBy === targetDebt.oweTo,
    );

    for (const potentialSimplifiedDebt of potentialSimplifiedDebts) {
      // Check if the simplified debt hasn't been created yet
      if (!potentialSimplifiedDebt.simplified) {
        // Mark the debts as simplified
        targetDebt.simplified = [targetDebt, potentialSimplifiedDebt];
        potentialSimplifiedDebt.simplified = [targetDebt, potentialSimplifiedDebt];

        // Calculate the new amount for the simplified debt
        const simplifiedAmount = targetDebt.amount - potentialSimplifiedDebt.amount;

        if (simplifiedAmount > 0) {
          // Create a new simplified debt instance
          const simplifiedDebt = new Debt(
            targetDebt.expense,
            simplifiedAmount,
            targetDebt.oweTo,
            potentialSimplifiedDebt.owedBy,
          );

          return simplifiedDebt;
        }
      }
    }

    return undefined; // No simplification found
  }
}

export default EventGraph;
