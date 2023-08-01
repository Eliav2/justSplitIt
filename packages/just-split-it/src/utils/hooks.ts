import { useState } from 'react';

export const useRerender = () => {
  const [, setRender] = useState({});
  return () => setRender({});
};
