// firestore.<collection>.document

import type { DocumentReference } from 'firebase/firestore';

export interface FirestoreEvent {
  name: string;
  ownerId: string;
  participantsIds: string[];
}

export interface FirestoreEventWithId extends FirestoreEvent {
  id: string;
}

export interface FirestoreUser {
  // reference to the user document
  name: string;
  email: string;
}

export interface FirestoreUserWithId extends FirestoreUser {
  id: string;
}

export interface FirestoreExpense {
  name: string;
  amount: number;
  payerId: string;
  payerName: string;
  parentEventId: string;
  participantsIds: string[];
}
