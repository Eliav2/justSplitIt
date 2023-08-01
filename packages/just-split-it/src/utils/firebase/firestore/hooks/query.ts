import { getDocs, doc, onSnapshot, query, where, getDoc, FirestoreError } from 'firebase/firestore';
import type {
  DocumentData,
  SnapshotListenOptions,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  Query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '@/utils/firebase/firestore/client';

export const useCollection = <T extends DocumentData>(
  query: Query<T, T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
  dependencies: any[] = [],
) => {
  const [error, setError] = useState<FirestoreError | null>(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<(T & { id: string })[]>([]);
  useEffect(() => {
    if (!query) return;
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLoading(false);
        setDocs(docs);
        // console.log('snap!');
        setError(null);
      },
      (error) => {
        setError(error);
        console.error(error);
      },
    );
    return () => {
      unsubscribe();
      setLoading(true);
      setError(null);
      setDocs([]);
    };
  }, [options?.enable ?? true, ...dependencies]);
  // console.log('err', error);
  return [docs, loading, error] as const;
};

// get and watch a single document
export const useDocument = <T extends DocumentData>(
  ref: DocumentReference<T, T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
  dependencies: any[] = [],
) => {
  const [loading, setLoading] = useState(true);
  const [snap, setSnap] = useState<DocumentSnapshot>();
  const [data, setData] = useState<T & { id: string }>();
  useEffect(() => {
    if (!ref) return;
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setLoading(false);
      setSnap(snapshot);
      setData({ ...snapshot.data(), id: ref.id } as T & { id: string });
    });
    return () => {
      unsubscribe();
      setLoading(true);
    };
  }, [options?.enable ?? true, ...dependencies]);

  return { data, loading, snap, ref } as const;
};

export const useGrabDocumentById = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docId: string,
) => {
  const docRef = doc(collection, docId);
  return useDocument<T>(docRef, {}, [docId]);
};

export const useGrabDocumentsById = <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docIds: string[] | undefined | null,
) => {
  const _docIds = docIds ?? [];
  const [documents, setDocuments] = useState<(T & { id: string })[]>([]);
  // return docIds?.map((docId) => useGrabDocumentById<T>(collection, docId));
  useEffect(() => {
    const docRefs = _docIds?.map((id) => doc(collection, id));
    if (docRefs.length == 0) return;
    const queryRef = query(collection, where('__name__', 'in', docRefs));
    // Execute the query to fetch the documents
    getDocs(queryRef)
      .then((querySnapshot) => {
        const fetchedDocuments = querySnapshot.docs.map((doc) => {
          // Extract the data from each document and store it in the array
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setDocuments(fetchedDocuments);
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
  }, [docIds]); // Empty dependency array to run the effect only once
  return documents;
};
