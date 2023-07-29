// firestore.<collection>.document

import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  FieldPath,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { collection, doc, getDoc } from 'firebase/firestore';

import { fbDB } from '@/utils/firebase/firebase';

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
type myGetDoc<T> = <Path extends keyof T>(
  fieldPath: Path | FieldPath,
  options?: SnapshotOptions,
) => Promise<T[Path]>;

const withMethods = <T extends DocumentData>(collection: CollectionReference) => {
  // const userRef = doc(collection, user.uid);
  // const userDoc = await getDoc(userRef);
  // if (!userDoc.exists()) return [];
  // const userData = await userDoc.data();
  // const events = await userDoc.get('events');

  const _doc = (documentPath?: string): DocumentReference<T, T> => {
    return doc(collection, documentPath) as DocumentReference<T, T>;
  };

  const myGet = async <Path extends keyof T>(
    fetchedDoc: Promise<QueryDocumentSnapshot<T, T>>,
    fieldPath: Path | FieldPath,
    options?: SnapshotOptions,
  ): Promise<T[Path]> => {
    return (await fetchedDoc).get(fieldPath as any, options) as T[Path];
  };

  const _getDoc = async (documentPath?: string) => {
    // const docRef = doc(collection, documentPath);
    const docRef = _doc(documentPath);
    const fetchedDoc = getDoc(docRef);
    return {
      ...fetchedDoc,
      //override get method with type safe version
      get: async <Path extends keyof T>(fieldPath: Path | FieldPath, options?: SnapshotOptions) =>
        myGet(fetchedDoc, fieldPath, options) as myGetDoc,
    };
  };

  return {
    collection, // for self reference
    doc: _doc,
    getDoc: _getDoc,
  };
};

export const firestore = {
  // use own withConverter wrapper
  event: (...pathSegments: string[]) =>
    withConverter<FirestoreEvent>(collection(fbDB, 'event', ...pathSegments)),
  // just to show how to wrap withConverter manually (for advanced use cases)
  user: (...pathSegments: string[]) =>
    withMethods<FirestoreUser>(
      collection(fbDB, 'user', ...pathSegments).withConverter({
        toFirestore: (user: FirestoreUser) => user,
        fromFirestore: (snapshot, options): FirestoreUser => {
          const data = snapshot.data(options);
          return data as FirestoreUser;
        },
      }),
    ),
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
