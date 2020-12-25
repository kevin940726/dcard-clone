import { useRef, useEffect } from 'react';

export default function useCurrent(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}
