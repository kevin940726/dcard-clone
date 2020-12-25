export default function useInfinite(fetchMore, isFetching, { rootRef } = {}) {
  function refCallback(node) {
    if (node) {
      function handleIntersect([entry]) {
        if (entry.isIntersecting && !isFetching) {
          fetchMore();

          observer.disconnect();
        }
      }

      const observer = new IntersectionObserver(handleIntersect, {
        root: rootRef?.current ?? null,
        rootMargin: '1000px 0px',
      });

      observer.observe(node);
    }
  }

  return <div style={{ height: '1px' }} ref={refCallback} />;
}
