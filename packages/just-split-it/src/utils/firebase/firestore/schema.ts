// firestore.<collection>.document

import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import type {
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';

import { fbAuth, fbDB } from '@/utils/firebase/firebase';

interface FirestoreEvent {
  name: string;
  ownerId: string;
}

interface FirestoreUser {
  // refence to the user document
  events: DocumentReference<FirestoreEvent, FirestoreEvent>[];
}

const withConverter = <T extends DocumentData>(
  collection: CollectionReference,
): CollectionReference<T, T> => {
  return collection.withConverter({
    toFirestore: (data: T) => data,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<T, T>,
      options: SnapshotOptions | undefined,
    ): T => {
      return snapshot.data(options) as T;
    },
  }) as CollectionReference<T, T>;
};

export const firestore = {
  user: (...pathSegments: string[]) =>
    // just to show how to wrap withConverter manually
    collection(fbDB, 'user', ...pathSegments).withConverter({
      toFirestore: (user: FirestoreUser) => user,
      fromFirestore: (snapshot, options): FirestoreUser => {
        const data = snapshot.data(options);
        return data as FirestoreUser;
      },
    }),
  // use own withConverter wrapper
  event: (...pathSegments: string[]) =>
    withConverter<FirestoreEvent>(collection(fbDB, 'event', ...pathSegments)),
};

// const eventRef = await addDoc(firestore.event(), {
//   name: '123',
// });
//
// const userCollection = firestore.user('123');
// const userRef = doc(userCollection, 'eliav');
// const userDoc = await getDoc(userRef);
// userDoc.data();
//
// const eventCollection = firestore.event('123');
