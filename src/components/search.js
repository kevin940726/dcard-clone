import { css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TabList from './tab-list';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import { filterQuery } from '../utils/filter-query';

const tabs = [
  { name: '綜合', pathname: '/search' },
  { name: '文章', pathname: '/search/posts' },
  { name: '看板', pathname: '/search/forums' },
  { name: '話題', pathname: '/search/topics' },
  { name: '卡稱', pathname: '/search/personas' },
];

function Search({ children }) {
  const router = useRouter();
  const isModalOpen = !!router.query.postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);

  return (
    <>
      <header
        css={css`
          position: sticky;
          top: 48px;
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          padding: 20px 12px 0 60px;
          z-index: 10;
        `}
      >
        <TabList>
          {tabs.map((tab) => (
            <Link
              key={tab.pathname}
              href={{
                pathname: tab.pathname,
                query: filterQuery({
                  query: router.query.query,
                  forum: router.query.forum,
                }),
              }}
              passHref
            >
              <TabList.Tab
                isActive={modalParentLocation.pathname === tab.pathname}
              >
                {tab.name}
              </TabList.Tab>
            </Link>
          ))}
        </TabList>
      </header>

      <div role="region" id="search-results" aria-live="polite">
        {children}
      </div>
    </>
  );
}

export default Search;
