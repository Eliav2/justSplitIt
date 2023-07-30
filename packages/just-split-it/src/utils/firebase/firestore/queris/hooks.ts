// get all events a user participates in
import { doc, limit, query, where } from 'firebase/firestore';
import { firestore } from '@/utils/firebase/firestore/client';
import { useCollection, useDocument } from '@/utils/firebase/firestore/hooks/query';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';

export function useGetUserEvents() {
  const [user] = useAuthState(fbAuth);
  const userEventsQuery =
    user &&
    query(firestore.event(), where('participantsIds', 'array-contains', user?.uid), limit(100));

  return useCollection(userEventsQuery, { enable: !!user });
}

export function useGetEvent(eventId: string) {
  const eventRef = doc(firestore.event(), eventId);
  return useDocument(eventRef, {}, [eventId]);
}

export const useGetEventExpenses = (eventId: string) => {
  const expensesQuery = query(firestore.expense(), where('parentEventId', '==', eventId));
  return useCollection(expensesQuery, {}, [eventId]);
};
