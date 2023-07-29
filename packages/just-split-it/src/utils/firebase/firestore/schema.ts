// firestore.<collection>.document

import type { DocumentReference } from 'firebase/firestore';

export interface FirestoreEvent {
  name: string;
  ownerId: string;
}

export interface FirestoreUser {
  // refence to the user document
  events: DocumentReference<FirestoreEvent, FirestoreEvent>[];
}
