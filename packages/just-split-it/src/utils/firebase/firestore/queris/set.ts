import { addDoc, doc, getDoc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { fbAuth } from '@/utils/firebase/firebase';

import { firestore } from '@/utils/firebase/firestore/client';
import { FirestoreExpense } from '@/utils/firebase/firestore/schema';
import { grabDocumentById } from '@/utils/firebase/firestore/queris/util';
import { IEventForm } from '@/pages/HomePage/NewEventDialog';

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

export const participantJoinsToEvent = async (eventId: string, participantId: string) => {
  const [eventSnap, eventRef] = await grabDocumentById(firestore.event(), eventId);
  if (!eventSnap || !eventRef) {
    throw new Error("event isn't found");
  }

  // // add the participant to the every expense of the event
  // const expensesQuery = query(firestore.expense(), where('parentEventId', '==', eventId));
  // const expenses = await getDocs(expensesQuery);
  // await Promise.all(
  //   expenses.docs.map(async (doc) => {
  //     const newParticipantsIds = [...doc.data().participantsIds, participantId];
  //     await setDoc(doc.ref, { participantsIds: newParticipantsIds }, { merge: true });
  //   }),
  // );

  const newParticipantsIds = [...eventSnap.participantsIds, participantId];
  await setDoc(eventRef, { participantsIds: newParticipantsIds }, { merge: true });
};

export const participantLeavesEvent = async (eventId: string, participantId: string) => {
  const [eventSnap, eventRef] = await grabDocumentById(firestore.event(), eventId);
  if (!eventSnap || !eventRef) {
    throw new Error("event isn't found");
  }

  // remove the expenses created by this user
  console.log('1', participantId);
  const userExpensesQuery = query(firestore.expense(), where('payerId', '==', participantId));
  const userExpenses = await getDocs(userExpensesQuery);
  console.log(userExpenses);
  await Promise.all(userExpenses.docs.map(async (doc) => await deleteExpense(doc.id)));
  // the participant leaves every expense he participated in
  const userParticipatedInExpensesQuery = query(
    firestore.expense(),
    where('participantsIds', 'array-contains', participantId),
  );
  const userParticipatedInExpenses = await getDocs(userParticipatedInExpensesQuery);
  await Promise.all(
    userParticipatedInExpenses.docs.map(async (doc) => {
      const newParticipantsIds = doc
        .data()
        .participantsIds.filter((id: string) => id !== participantId);
      await setDoc(doc.ref, { participantsIds: newParticipantsIds }, { merge: true });
    }),
  );
  // remove from the participant's list of the event
  const newParticipantsIds = eventSnap.participantsIds.filter((id) => id !== participantId);
  await setDoc(eventRef, { participantsIds: newParticipantsIds }, { merge: true });
};
