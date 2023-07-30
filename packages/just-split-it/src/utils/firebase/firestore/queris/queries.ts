import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { fbAuth } from '@/utils/firebase/firebase';

import { firestore } from '@/utils/firebase/firestore/client';
import { FirestoreExpense } from '@/utils/firebase/firestore/schema';

// add event to the events collection and to the user's events list
export async function addEvent(eventName: string) {
  if (!fbAuth.currentUser) {
    throw new Error('user not logged in');
  }

  // add event to the events collection
  const eventRef = await addDoc(firestore.event(), {
    name: eventName,
    ownerId: fbAuth.currentUser?.uid,
    participantsIds: [fbAuth.currentUser?.uid],
  });

  // add event to the user's events list
  // const userRef = doc(fbDB, 'user', fbAuth.currentUser!.uid);
  // const userRef = doc(firestore.user(), fbAuth.currentUser.uid);
  // const userDoc = await getDoc(userRef);
  // const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  // const userRef = firestore.user().doc(fbAuth.currentUser!.uid);
  // const userDoc = await getDoc(userRef);
  // const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  // await setDoc(
  //   userRef,
  //   {
  //     events: [...userEvents, eventRef],
  //   },
  //   { merge: true },
  // );
}

export const addExpense = async (data: FirestoreExpense) => {
  const expenseRef = await addDoc(firestore.expense(), {
    name: data.name,
    amount: data.amount,
    payerId: data.payerId,
    parentEventId: data.parentEventId,
  });
};
