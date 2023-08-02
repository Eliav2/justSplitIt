// get all events a user participates in
import {
  collection,
  doc,
  DocumentSnapshot,
  getFirestore,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '@/utils/firebase/firestore/client';
import {
  useGrabDocumentById,
  useGrabDocumentDataById,
  // useCollection,
  // useDocument,
  // useGrabDocumentById,
  useGrabDocumentsByIds,
  useGrabDocumentsDataByIds,
} from '@/utils/firebase/firestore/hooks/query';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbApp, fbAuth } from '@/utils/firebase/firebase';
import {
  useCollection as useFirestoreCollection,
  useCollectionData,
} from '@/react-firebase-hooks/firestore/useCollection';
import { useDocument as useFirestoreDocument } from '@/react-firebase-hooks/firestore/useDocument';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';

export function useGetUserEvents() {
  const [user] = useAuthState(fbAuth);
  const userEventsQuery =
    user &&
    query(firestore.event(), where('participantsIds', 'array-contains', user?.uid), limit(100));

  return useFirestoreCollection(userEventsQuery);
  // const userEventsQuery =
  //   user &&
  //   query(firestore.event(), where('participantsIds', 'array-contains', user?.uid), limit(100));
  //
  // return useCollection(userEventsQuery, { enable: !!user });
}

export function useGetEvent(eventId: string) {
  const eventRef = doc(firestore.event(), eventId);
  return useFirestoreDocument(eventRef);
  // const eventRef = doc(firestore.event(), eventId);
  // return useDocument(eventRef, {}, [eventId]);
}

export const useGetEventExpenses = (eventId: string, dependencies?: any[]) => {
  const expensesQuery = query(firestore.expense(), where('parentEventId', '==', eventId));
  return useFirestoreCollection(
    expensesQuery,
    { snapshotListenOptions: { includeMetadataChanges: true } },
    dependencies ?? [],
  );

  // const expensesQuery = query(firestore.expense(), where('parentEventId', '==', eventId));
  // return useCollection(expensesQuery, {}, [eventId]);
};

export const useExpense = (expenseId: string) => {
  return useGrabDocumentDataById(firestore.expense(), expenseId);
};

export const useParticipantsByIds = (participantsId: string[] | undefined) => {
  return useGrabDocumentsDataByIds(firestore.user(), participantsId ?? []);
};
