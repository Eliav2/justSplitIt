import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  SnapshotListenOptions,
} from 'firebase/firestore';
import { doc, FirestoreError, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  useCollection as useFirestoreCollection,
  useCollectionData,
  useCollectionOnce,
} from '@/react-firebase-hooks/firestore/useCollection';
import { useDocument, useDocumentData } from '@/react-firebase-hooks/firestore';

export const useCollection = <T extends DocumentData>(
  query: Query<T, T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
  dependencies: any[] = [],
) => {
  const [error, setError] = useState<FirestoreError | null>(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<(T & { id: string })[]>([]);

  const handleQuerySnapShot = (snapshot: QuerySnapshot<T, T>) => {
    const docs = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setLoading(false);
    setDocs(docs);
    setError(null);
  };
  const handleQueryError = (error: FirestoreError) => {
    setError(error);
    console.error(error);
  };

  useEffect(() => {
    if (!query) return;
    const unsubscribe = onSnapshot(query, handleQuerySnapShot, handleQueryError);
    return () => {
      unsubscribe();
      setLoading(true);
      setError(null);
      setDocs([]);
    };
  }, [options?.enable ?? true, ...dependencies]);

  // can be used if permissions are changed
  const refresh = async () => {
    if (!query) return;
    setLoading(true);
    const querySnapshot = await getDocs(query)
      .catch(handleQueryError)
      .finally(() => setLoading(false));

    if (!querySnapshot) return;
    handleQuerySnapShot(querySnapshot);
  };

  // console.log('err', error);
  return { docs, loading, error, refresh } as const;
};

// old implementation
// // get and watch a single document
// export const useDocument = <T extends DocumentData>(
//   ref: DocumentReference<T, T> | undefined | null,
//   options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
//   dependencies: any[] = [],
// ) => {
//   const [loading, setLoading] = useState(true);
//   const [snap, setSnap] = useState<DocumentSnapshot>();
//   const [data, setData] = useState<T & { id: string }>();
//   useEffect(() => {
//     if (!ref) return;
//     const unsubscribe = onSnapshot(ref, (snapshot) => {
//       setLoading(false);
//       setSnap(snapshot);
//       setData({ ...snapshot.data(), id: ref.id } as T & { id: string });
//     });
//     return () => {
//       unsubscribe();
//       setLoading(true);
//     };
//   }, [options?.enable ?? true, ...dependencies]);
//
//   // can be used if permissions are changed
//   const refresh = async () => {
//     if (!ref) return;
//     const docSnap = await getDoc(ref);
//     setSnap(docSnap);
//   };
//
//   return { data, loading, snap, ref, refresh } as const;
// };

// export const useGrabDocumentById = <T extends DocumentData>(
//   collection: CollectionReference<T, T>,
//   docId: string,
// ) => {
//   const docRef = doc(collection, docId);
//   return useDocument<T>(docRef, {}, [docId]);
// };

export const useGrabDocumentsByIds = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docIds: string[] | undefined | null,
) => {
  // const _docIds = docIds ?? [];
  // const [snap, setSnap] = useState<QuerySnapshot<T> | null>(null);
  // const [documents, setDocuments] = useState<(T & { id: string })[]>([]);
  // // return docIds?.map((docId) => useGrabDocumentById<T>(collection, docId));
  // useEffect(() => {
  //   const docRefs = _docIds?.map((id) => doc(collection, id));
  //   if (docRefs.length == 0) return;
  //   const queryRef = query(collection, where('__name__', 'in', docRefs));
  //   // Execute the query to fetch the documents
  //   getDocs(queryRef)
  //     .then((querySnapshot) => {
  //       setSnap(querySnapshot);
  //       const fetchedDocuments = querySnapshot.docs.map((doc) => {
  //         // Extract the data from each document and store it in the array
  //         const data = doc.data();
  //         return { id: doc.id, ...data };
  //       });
  //       setDocuments(fetchedDocuments);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching documents:', error);
  //     });
  // }, [docIds]); // Empty dependency array to run the effect only once
  // return [snap] as const;

  const _docIds = docIds ?? [];
  const docRefs = _docIds?.map((id) => doc(collection, id));
  const q = query(collection, where('__name__', 'in', docRefs));
  // useFirestoreCollection(q);
  return useFirestoreCollection(q);
};

export const useGrabDocumentById = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docId: string | undefined | null,
) => {
  const docRef = doc(collection, docId ?? '');
  return useDocument(docRef);
};

export const useGrabDocumentDataById = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docId: string,
) => {
  const docRef = doc(collection, docId);
  return useDocumentData<T>(docRef, {});
};

export const useGrabDocumentsDataByIds = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docIds: string[] | undefined | null,
) => {
  const _docIds = docIds ?? [];
  const docRefs = _docIds?.map((id) => doc(collection, id));
  const q = docRefs.length > 0 ? query(collection, where('__name__', 'in', docRefs)) : null;
  return useCollectionData(q);
};
