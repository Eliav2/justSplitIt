import { addDoc, doc, getDoc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { fbAuth } from '@/utils/firebase/firebase';

import { firestore } from '@/utils/firebase/firestore/client';
import { FirestoreExpense } from '@/utils/firebase/firestore/schema';
import { grabDocumentById } from '@/utils/firebase/firestore/queris/util';
import { IEventForm } from '@/pages/Welcome/NewEventDialog';

// add event to the events collection and to the user's events list
export async function addEvent(eventDetails: IEventForm) {
  if (!fbAuth.currentUser) {
    throw new Error('user not logged in');
  }

  // add event to the events collection
  const eventRef = await addDoc(firestore.event(), {
    name: eventDetails.name,
    description: eventDetails.description,
    ownerId: fbAuth.currentUser?.uid,
    participantsIds: [fbAuth.currentUser?.uid],
  });
  return eventRef;
}

export const addExpense = async (data: FirestoreExpense) => {
  return await addDoc(firestore.expense(), data);
};

export const deleteExpense = async (expenseId: string) => {
  const expenseRef = doc(firestore.expense(), expenseId);
  await deleteDoc(expenseRef);
};

export const deleteEvent = async (eventId: string) => {
  const eventRef = doc(firestore.event(), eventId);

  //query for all expenses of this event
  const expensesQuery = query(firestore.expense(), where('parentEventId', '==', eventId));
  const expenses = await getDocs(expensesQuery);

  // delete all expenses of this event
  expenses.forEach(async (expense) => {
    await deleteExpense(expense.id);
  });

  // delete the event
  await deleteDoc(eventRef);
};
