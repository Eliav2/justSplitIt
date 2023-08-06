// firestore.<collection>.document

import type { DocumentReference } from 'firebase/firestore';
import type { FieldValue, serverTimestamp } from 'firebase/firestore';

export interface FirestoreEvent {
  name: string;
  ownerId: string;
  participantsIds: string[];
  description?: string;
  creationTimestamp: FieldValue & { seconds: number; nanoseconds: number };
}

export interface FirestoreEventWithId extends FirestoreEvent {
  id: string;
}

export interface FirestoreUser {
  // reference to the user document
  name: string;
  email: string;
  creationTimestamp: FieldValue;
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
  creationTimestamp: FieldValue;
  editTimestamp: FieldValue;
}
