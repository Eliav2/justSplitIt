import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { firestore } from '@/utils/firebase/firestore/client';
import {
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  refEqual,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect } from 'react';

export const useEnsureUserExists = () => {
  const [user] = useAuthState(fbAuth);
  // const userRef = doc(firestore.user(), user.uid);
  // const userDoc = getDoc(userRef).then();
  useEffect(() => {
    if (!user) return;
    const userRef = doc(firestore.user(), user.uid);
    getDoc(userRef).then((userDoc) => {
      if (!userDoc.exists()) {
        setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          creationTimestamp: serverTimestamp(),
        });
      }
    });
  }, [user]);
};

export const isRefEqual = <T extends DocumentReference<any> | CollectionReference<any>>(
  v1: T | null | undefined,
  v2: T | null | undefined,
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && refEqual(v1, v2);
  return bothNull || equal;
};
