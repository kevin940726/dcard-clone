import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function useModalParentLocation(isModalOpen) {
  const router = useRouter();
  const modalParentLocationRef = useRef(router);

  useEffect(() => {
    if (!isModalOpen) {
      modalParentLocationRef.current = router;
    }
  }, [isModalOpen, router]);

  return isModalOpen ? modalParentLocationRef.current : router;
}
