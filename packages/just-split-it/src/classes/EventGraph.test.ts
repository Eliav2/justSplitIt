import { describe, expect, it, test } from 'vitest';
import EventGraph from './EventGraph';

describe('Events simplified correctly', () => {
  it('case 1: 3 participants, 3 expenses', () => {
    const eventGraph = new EventGraph(
      [
        {
          id: '1',
          name: 'אליאב',
          email: 'a@gmail.com',
          creationTimestamp: {} as any,
        },
        {
          id: '2',
          name: 'אורטל',
          email: 'b@gmail.com',
          creationTimestamp: {} as any,
        },
        {
          id: '3',
          name: 'דוד',
          email: 'c@gmail.com',
          creationTimestamp: {} as any,
        },
      ],
      [
        {
          id: '1',
          name: 'פיצה',
          payerName: 'אליאב',
          payerId: '1',
          amount: 90,
          parentEventId: '1',
          participantsIds: ['1', '2', '3'],
          creationTimestamp: {} as any,
          editTimestamp: {} as any,
        },
        {
          id: '2',
          name: 'אלכוהול',
          payerName: 'דוד',
          payerId: '3',
          amount: 210,
          parentEventId: '1',
          participantsIds: ['1', '2', '3'],
          creationTimestamp: {} as any,
          editTimestamp: {} as any,
        },
        {
          id: '3',
          name: 'עוגה',
          payerName: 'אורטל',
          payerId: '2',
          amount: 120,
          parentEventId: '1',
          participantsIds: ['1', '2', '3'],
          creationTimestamp: {} as any,
          editTimestamp: {} as any,
        },
      ],
    );

    const debts = eventGraph.allDebts;
    const simplifiedDebts = eventGraph.getSimplifiedDebts();

    console.log(eventGraph);
    expect(true);
  });

  // expect(sum(1, 2)).toBe(3)
  it('case 2: 3 participants, 2 expenses', () => {
    const eventGraph = new EventGraph(
      [
        {
          id: 'A',
          name: 'A',
          email: 'A@gmail.com',
          creationTimestamp: {} as any,
        },
        {
          id: 'B',
          name: 'B',
          email: 'B@gmail.com',
          creationTimestamp: {} as any,
        },
        {
          id: 'C',
          name: 'C',
          email: 'C@gmail.com',
          creationTimestamp: {} as any,
        },
      ],
      [
        {
          id: '1',
          name: '1',
          payerName: 'C',
          payerId: 'C',
          amount: 10,
          parentEventId: '1',
          participantsIds: ['B'],
          creationTimestamp: {} as any,
          editTimestamp: {} as any,
        },
        {
          id: '2',
          name: '2',
          payerName: 'B',
          payerId: 'B',
          amount: 15,
          parentEventId: '1',
          participantsIds: ['A'],
          creationTimestamp: {} as any,
          editTimestamp: {} as any,
        },
      ],
    );
    const debts = eventGraph.allDebts;
    const simplifiedDebts = eventGraph.getSimplifiedDebts();

    console.log(eventGraph);
    expect(true);
  });
});
