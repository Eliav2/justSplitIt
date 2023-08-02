import React, { useRef } from 'react';

/**
 * this is used to preserve the ref of the child element if given, and promise that the wrapper
 * component has a valid ref to the child element
 *
 * this is used on a wrapper component with single child
 * this hook checks if the child element is passing a ref element, and
 * if it is, it sets the ref to the given ref,else it creates a new ref and returns it
 *
 * @param children - child of the component
 */
export const usePassChildrenRef = <T extends any = any>(children: any): React.RefObject<T> => {
  return usePassRef<T>(children.ref);
};

/**
 * this is used to preserve the ref of an element if given, and if not given, it creates a new ref.
 * this is useful on a component that should pass refs, and also uses the ref internally
 * (if the internal component counts on the parent component to pass ref, it might be ended with null)
 */
export const usePassRef = <T extends any = any>(ref: React.RefObject<T>): React.RefObject<T> => {
  const nodeRef = useRef<T>(null);
  let passRef = nodeRef;
  // React.Children.only(children); // optionally, this will throw error if there are more than one child
  if (ref && 'current' in ref) {
    // @ts-ignore
    // if it has ref, set the ref to the given ref
    nodeRef.current = ref.current;
    passRef = ref;
  }
  return passRef;
};

export default usePassRef;
