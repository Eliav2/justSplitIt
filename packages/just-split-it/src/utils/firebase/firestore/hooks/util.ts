import { useAuthState } from 'react-firebase-hooks/auth';
import { fbAuth } from '@/utils/firebase/firebase';
import { firestore } from '@/utils/firebase/firestore/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
        });
      }
    });
  }, [user]);
};
