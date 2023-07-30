// firestore.<collection>.document

import type { DocumentReference } from 'firebase/firestore';

export interface FirestoreEvent {
  name: string;
  ownerId: string;
  participantsIds: string[];
}

export interface FirestoreUser {
  // refence to the user document
  name: string;
  email: string;
  events: DocumentReference<FirestoreEvent, FirestoreEvent>[];
}
