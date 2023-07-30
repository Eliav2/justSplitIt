import {
  getDocs,
  CollectionReference,
  doc,
  onSnapshot,
  query,
  Query,
  where,
} from 'firebase/firestore';
import type { DocumentData, SnapshotListenOptions, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '@/utils/firebase/firestore/client';

export const useCollection = <T extends DocumentData>(
  query: Query<T, T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
) => {
  const [docs, setDocs] = useState<(T & { id: string })[]>([]);
  useEffect(() => {
    if (!query) return;
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocs(docs);
    });
    return unsubscribe;
  }, [options?.enable ?? true]);
  return docs;
};

// get and watch a single document
export const useDocument = <T extends DocumentData>(
  docRef: DocumentReference<T, T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
  dependencies: any[] = [],
) => {
  const [doc, setDoc] = useState<T & { id: string }>();
  useEffect(() => {
    if (!docRef) return;
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setDoc({ ...snapshot.data(), id: docRef.id } as T & { id: string });
    });
    return unsubscribe;
  }, [options?.enable ?? true, ...dependencies]);
  return doc;
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
