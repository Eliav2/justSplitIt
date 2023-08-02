import React from 'react';
import { FirestoreEvent } from '@/utils/firebase/firestore/schema';

const EventContext = React.createContext<FirestoreEvent | undefined>(undefined);
export const useEventContext = () => {
  const context = React.useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within a EventContextProvider');
  }
  return context;
};
export default EventContext;
