import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { fbAuth, fbDB } from '@/utils/firebase/firebase';

// add event to the events collection and to the user's events list
export async function addEvent(eventName: string) {
  if (!fbAuth.currentUser) {
    throw new Error('user not logged in');
  }

  // add event to the events collection
  const eventRef = await addDoc(firestore.event(), {
    name: eventName,
    ownerId: fbAuth.currentUser?.uid,
  });

  // add event to the user's events list
  // const userRef = doc(fbDB, 'user', fbAuth.currentUser!.uid);
  const userRef = doc(firestore.user(), fbAuth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  // const userRef = firestore.user().doc(fbAuth.currentUser!.uid);
  // const userDoc = await getDoc(userRef);
  // const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  await setDoc(
    userRef,
    {
      events: [...userEvents, eventRef],
    },
    { merge: true },
  );
}

// get all events a user participates in
export async function getUserEvents() {
  const userRef = doc(fbDB, 'user', fbAuth.currentUser!.uid);
  const userDoc = await getDoc(userRef);
  const userEvents = (userDoc.exists() && userDoc.data().events) || [];
  return userEvents;
}

import { query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { firestore } from '@/utils/firebase/firestore/client';

export const useUserEvents = async () => {
  const [user] = useAuthState(fbAuth);
  if (!user) return [];
  // console.log(user.uid);
  // const userRef = doc(collection(fbDB, 'user'), user.uid);

  // const safeEvents = await firestore.user().get('events');
  // const edoc = await firestore.user().getDoc(user.uid);
  // const edoc2 = await edoc.get('events');
  const userSafeRef = firestore.user().doc(user.uid);

  const userSafeDoc = await firestore.user().doc(user.uid).getDoc();

  const eventsRefs = await (await firestore.user().doc(user.uid).getDoc()).get('events');

  const eventsData = await Promise.all(
    eventsRefs.map(async (event) => (await getDoc(event)).data()),
  );
  console.log(eventsData);

  const userRef = doc(firestore.user().collection, user.uid);

  const userDoc = await getDoc(userRef);
  // userDoc.get();
  // userDoc.data()

  // if (!userDoc.exists()) return [];
  // const userData = await userDoc.data();
  // const events = await userDoc.get('events');
  // console.log('userData', userData);
  // // console.log('events', events);
  // console.log('safeEvents', safeEvents);
  // console.log('safeEvents', safeEvents);

  // Create a query to fetch all documents in the 'events' subcollection
  // const eventsQuery = query(userRef); // useEffect(() => {

  //     const unsubscribe = onSnapshot(doc(fbDB, 'user', fbAuth.currentUser!.uid), (doc) => {
  //         const userEvent  s = (doc.exists() && doc.data().events) || [];
  //         setUserEvents(userEvents);
  //     });
  //     return unsubscribe;
  // }]
};
