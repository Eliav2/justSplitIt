import { useDocument, useGrabDocumentById } from '@/utils/firebase/firestore/hooks/query';
import { CollectionReference, doc, DocumentData, getDoc } from 'firebase/firestore';

export const grabDocumentById = async <T extends DocumentData>(
  collection: CollectionReference<T, T>,
  docId: string,
) => {
  const docRef = doc(collection, docId);
  const docSnap = await getDoc(docRef);

  // if (!docSnap.exists()) return null;
  return docSnap.data();
};
