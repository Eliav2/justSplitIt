import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  FieldPath,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { fbApp, fbDB } from '@/utils/firebase/firebase';
import type { FirestoreEvent, FirestoreExpense, FirestoreUser } from './schema';

const withConverter = <T extends DocumentData>(
  collectionRef: CollectionReference,
): CollectionReference<T, T> => {
  return collectionRef.withConverter({
    toFirestore: (data: T) => data,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<T, T>,
      options: SnapshotOptions | undefined,
    ): T => {
      return snapshot.data(options);
    },
  }) as CollectionReference<T, T>;
};

const collectionType = <T extends DocumentData>(collection: CollectionReference<any, any>) => {
  return collection as CollectionReference<T, T>;
};

type myGetDoc<T> = <Path extends keyof T>(
  fieldPath: Path | FieldPath,
  options?: SnapshotOptions,
) => Promise<T[Path]>;
type WithoutGet<T> = T extends { get: any } ? Pick<T, Exclude<keyof T, 'get'>> : T;
type StripUtility<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

const withMethods = <T extends DocumentData>(collection: CollectionReference) => {
  // const userRef = doc(collection, user.uid);
  // const userDoc = await getDoc(userRef);
  // if (!userDoc.exists()) return [];
  // const userData = await userDoc.data();
  // const events = await userDoc.get('events');

  const _doc = (documentPath?: string) => {
    return Object.assign(
      {
        // expose getDoc method right on the reference
        // this method will act getDoc on self
        getDoc: async () => {
          const docRef = doc(collection, documentPath);
          const fetchedDoc = await getDoc(docRef);

          // //override get method with type safe version
          // const getSafe = async <Path extends keyof T>(
          //   fieldPath: Path | FieldPath,
          //   options?: SnapshotOptions,
          // ): Promise<T[Path]> => {
          //   return fetchedDoc.get(fieldPath as any, options) as T[Path];
          // };
          // // fetchedDoc.get = myGet;
          //
          // return structuredClone(fetchedDoc) as typeof fetchedDoc & { getSafe: typeof getSafe };

          return Object.assign(
            //override get method with type safe version
            {},
            {
              get: async <Path extends keyof T>(
                fieldPath: Path | FieldPath,
                options?: SnapshotOptions,
              ): Promise<T[Path]> => {
                return (await fetchedDoc).get(fieldPath as any, options) as T[Path];
              },
            },
            fetchedDoc,
          );
        },
      },
      doc(collection, documentPath) as DocumentReference<T, T>,
    );
  };

  // const _getDoc = async (documentPath?: string) => {
  //   const docRef = _doc(documentPath);
  //   const fetchedDoc = await getDoc(docRef);
  //   return Object.assign(
  //     //override get method with type safe version
  //     {
  //       get: async <Path extends keyof T>(
  //         fieldPath: Path | FieldPath,
  //         options?: SnapshotOptions,
  //       ): Promise<T[Path]> => {
  //         return (await fetchedDoc).get(fieldPath as any, options) as T[Path];
  //       },
  //     },
  //     fetchedDoc,
  //   );
  // };

  return {
    collection, // for self reference
    doc: _doc,
  };
};
export const firestore = {
  // use own withConverter wrapper
  // event: (...pathSegments: string[]) => collection(getFirestore(fbApp), 'event', ...pathSegments),
  event: (...pathSegments: string[]) =>
    // withConverter<FirestoreEvent>(collection(getFirestore(fbApp), 'event', ...pathSegments)),
    collectionType<FirestoreEvent>(collection(getFirestore(fbApp), 'event', ...pathSegments)),
  // just to show how to wrap withConverter manually (for advanced use cases)
  user: (...pathSegments: string[]) =>
    collectionType<FirestoreUser>(collection(getFirestore(fbApp), 'user', ...pathSegments)),
  // // withMethods<FirestoreUser>(
  // collection(getFirestore(fbApp), 'user', ...pathSegments).withConverter({
  //   toFirestore: (user: FirestoreUser) => user,
  //   fromFirestore: (snapshot, options): FirestoreUser => {
  //     const data = snapshot.data(options);
  //     return data as FirestoreUser;
  //   },
  // }),
  // ),
  // expense: collection(getFirestore(fbApp), 'expense'),
  expenseName: (...pathSegments: string[]) =>
    collectionType<FirestoreExpense>(collection(getFirestore(fbApp), 'expense', ...pathSegments)),
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
// const edoc = await firestore.user().getDoc('123');
