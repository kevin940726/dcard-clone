import { useMemo } from 'react';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import {
  setDehydratedForums,
  useForumsByIDQuery,
  mapForumsById,
} from '../hooks/use-forums-query';
import SearchBar from './search-bar';

function ForumItem({
  as: Component = 'li',
  isActive,
  forumAlias,
  href,
  logo,
  logoSize = 30,
  children,
}) {
  return (
    <Component>
      <Link href={href || `/f/${forumAlias}`} passHref>
        <a
          title={children}
          css={css`
            display: flex;
            align-items: center;
            height: 44px;
            padding: 0 10px 0 20px;
            color: rgb(255, 255, 255);
            text-decoration: none;
            font-size: 16px;

            ${isActive
              ? css`
                  background-color: rgba(255, 255, 255, 0.3);
                `
              : css`
                  &:hover {
                    background-color: rgba(0, 0, 0, 0.2);
                  }
                `}
          `}
        >
          <span
            css={css`
              display: inline-flex;
              height: 30px;
              width: 30px;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
            `}
          >
            {logo && (
              <Image
                src={logo}
                alt=""
                width={logoSize}
                height={logoSize}
                css={css`
                  border-radius: 50%;
                  flex-shrink: 0;
                `}
              />
            )}
          </span>
          <span
            css={css`
              margin: 0 10px 0 8px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            `}
          >
            {children}
          </span>
        </a>
      </Link>
    </Component>
  );
}

function ForumsSection({ id, label, forums, children }) {
  const router = useRouter();

  return (
    <section aria-labelledby={id}>
      <h3
        id={id}
        css={css`
          display: flex;
          align-items: center;
          height: 44px;
          font-size: 14px;
          font-weight: normal;
          padding: 0 10px 0 20px;
          margin: 0;
          color: rgba(255, 255, 255, 0.35);
        `}
      >
        {label}
      </h3>
      <ul
        css={css`
          list-style: none;
          padding: 0;
          margin: 0;
        `}
      >
        {forums.map((forum) => (
          <ForumItem
            key={forum.id}
            forumAlias={forum.alias}
            isActive={
              (router.pathname === '/f/[forumAlias]' ||
                router.pathname === '/f/[forumAlias]/rule') &&
              router.query.forumAlias === forum.alias
            }
            logo={forum.logo?.url}
          >
            {forum.name}
          </ForumItem>
        ))}
        {children}
      </ul>
    </section>
  );
}

function Layout({ children, aside, ...props }) {
  const router = useRouter();
  const { data: forumsById } = useForumsByIDQuery();
  const { data: popularForumsResult = [] } = useQuery(
    ['forums/popular-forums', { limit: 8 }],
    {
      staleTime: Infinity,
    }
  );
  const { data: selectedForumsList = [] } = useQuery('forums/selected-forums', {
    staleTime: Infinity,
  });

  const popularForums = useMemo(
    () =>
      popularForumsResult
        .map((forum) => forumsById?.[forum.id])
        .filter(Boolean),
    [popularForumsResult, forumsById]
  );
  const selectedForums = useMemo(
    () =>
      selectedForumsList.map((forum) => forumsById?.[forum.id]).filter(Boolean),
    [selectedForumsList, forumsById]
  );

  return (
    <div>
      <header
        css={css`
          position: sticky;
          top: 0;
          left: 0;
          height: 48px;
          background: rgb(0, 106, 166);
          color: white;
          z-index: 10;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            padding: 0 36px;
            max-width: 1280px;
            height: 100%;
            margin: 0 auto;
            box-sizing: border-box;
          `}
        >
          <Link href="/f">
            <a title="Dcard" aria-label="Dcard">
              <Image src="/logo.svg" alt="Dcard" width={74.42} height={28} />
            </a>
          </Link>

          <SearchBar />
        </div>
      </header>

      <div
        css={css`
          display: flex;
          max-width: 1280px;
          margin: 0 auto;
        `}
      >
        <nav
          css={css`
            position: sticky;
            top: 68px;
            height: calc(100vh - 88px);
            width: 208px;
            align-self: flex-start;
            flex-shrink: 0;
            margin: 20px 0;
            display: flex;
            flex-direction: column;
          `}
        >
          <ForumItem
            as="div"
            logo="/all-forums-logo.svg"
            logoSize={24}
            href="/forum/all"
            isActive={router.pathname === '/forum/all'}
          >
            所有看板
          </ForumItem>
          <ForumItem
            as="div"
            logo="/popular-forums-logo.svg"
            logoSize={24}
            href="/forum/popular"
            isActive={router.pathname === '/forum/popular'}
          >
            即時熱門看板
          </ForumItem>

          <div
            css={css`
              height: 100%;
              overflow: auto;
            `}
          >
            <ForumsSection
              id="popular-forums"
              label="即時熱門看板"
              forums={popularForums}
            >
              <ForumItem href="/forum/popular">更多</ForumItem>
            </ForumsSection>

            <ForumsSection
              id="selected-forums"
              label="Dcard 精選看板"
              forums={selectedForums}
            />
          </div>
        </nav>

        <main
          css={css`
            flex-shrink: 0;
            width: 728px;
            margin: 20px 12px 0;
            border-radius: 4px 4px 0 0;
            background-color: #fff;
          `}
          {...props}
        >
          {children}
        </main>

        <aside
          css={css`
            width: 300px;
            margin: 20px 0;
            flex-shrink: 0;
          `}
        >
          {aside}
        </aside>
      </div>
    </div>
  );
}

Layout.prefetchQueries = async function prefetchQueries(queryClient) {
  const [forums, popularForumsData, selectedForums] = await Promise.all([
    queryClient.fetchQuery('forums'),
    queryClient.fetchQuery(['forums/popular-forums', { limit: 8 }]),
    queryClient.fetchQuery('forums/selected-forums'),
  ]);

  const forumsById = mapForumsById(forums);

  const dehydratedForums = {};
  [...popularForumsData, ...selectedForums].forEach((forumData) => {
    const forum = forumsById[forumData.id];
    dehydratedForums[forum.alias] = forum;
  });

  setDehydratedForums(queryClient, dehydratedForums);
};

export default Layout;
