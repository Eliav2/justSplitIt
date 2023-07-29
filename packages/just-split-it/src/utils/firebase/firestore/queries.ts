import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { fbAuth, fbDB } from '@/utils/firebase/firebase';

export async function addEventToUser(eventName: string) {
  const userRef = doc(fbDB, 'user', fbAuth.currentUser!.uid);
  const userDoc = await getDoc(userRef);
  const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  await setDoc(
    userRef,
    {
      events: [...userEvents, { name: eventName }],
    },
    { merge: true },
  );
  // try {
  //   const userDoc = await getDoc(userRef);
  //
  //   if (userDoc.exists()) {
  //     // If the user exists, add the event to the events list
  //     await updateDoc(userRef, {
  //       events: [...userDoc.data().events, { name: eventName }],
  //     });
  //   } else {
  //     // If the user does not exist, create a new user document with the event
  //     await setDoc(userRef, {
  //       events: [{ name: eventName }],
  //     });
  //   }
  //
  //   console.log("Event added to the user's events list.");
  // } catch (error) {
  //   console.error('Error adding event to user:', error);
  // }
}

export async function addEvent(eventName: string) {
  return Promise.all([
    // add event to the events collection
    addDoc(collection(fbDB, 'event'), {
      name: eventName,
      owner: fbAuth.currentUser?.uid,
    }),
    // add event to the user's events list
    addEventToUser(eventName),
  ]);
}
