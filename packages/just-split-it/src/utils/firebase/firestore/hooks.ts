import { onSnapshot, Query } from 'firebase/firestore';
import type { DocumentData, SnapshotListenOptions, DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';

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
  docRef: DocumentReference<T> | undefined | null,
  options?: { enable?: boolean; snapshotListenOptions?: SnapshotListenOptions },
  dependencies: any[] = [],
) => {
  const [doc, setDoc] = useState<T>();
  useEffect(() => {
    if (!docRef) return;
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setDoc(snapshot.data());
    });
    return unsubscribe;
  }, [options?.enable ?? true, ...dependencies]);
  return doc;
};
