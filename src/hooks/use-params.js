import { useMemo } from 'react';
import { useRouter } from 'next/router';

const PARAM_REGEX = /\/\[(\w+)\](?:$|[/?#])/g;

// There seems to be no official ways in Next.js to distinguish search params from route params.
// e.g. /f/[forumAlias] and /f?forumAlias= both have the forumAlias key in router.query
// Hence, this hook parses the route and returns only the route params.
export default function useParams() {
  const router = useRouter();

  return useMemo(() => {
    const params = {};

    let match;

    do {
      match = PARAM_REGEX.exec(router.route);

      if (match) {
        const [, param] = match;
        params[param] = router.query[param];
      }
    } while ((match = PARAM_REGEX.exec(router.route)));

    PARAM_REGEX.lastIndex = 0;

    return params;
  }, [router]);
}
