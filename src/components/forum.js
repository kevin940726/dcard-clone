import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  useDisclosureState,
  Disclosure,
  DisclosureContent,
  VisuallyHidden,
} from 'reakit';
import useParams from '../hooks/use-params';
import {
  useForumByAlias,
  setDehydratedForums,
} from '../hooks/use-forums-query';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import useAnimateHeight from '../hooks/use-animate-height';
import Head from './head';
import TabList from './tab-list';
import ArrowIcon from './arrow-icon';
import TopicTag from './topic-tag';
import ForumPostsFrequency from './forum-posts-frequency';

const Header = styled.header`
  position: sticky;
  top: 48px;
  padding: 20px 60px 0;
  z-index: 10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
`;

function ForumLayout({ forum }) {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { latest } = modalParentLocation.query;

  let tab = 'popular';
  if (latest) {
    tab = 'latest';
  } else if (router.pathname.endsWith('/rule')) {
    tab = 'rule';
  }

  return (
    <>
      <div
        css={css`
          position: relative;
          height: 243px;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
        `}
      >
        <Image
          src={forum.heroImage?.url ?? '/forum-hero-placeholder.svg'}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <Header>
        <div
          css={css`
            display: flex;
            align-items: center;
            height: 60px;
          `}
        >
          <Image
            src={forum.logo?.url ?? '/forum-logo-placeholder.svg'}
            width={40}
            height={40}
            alt="Logo"
            css={css`
              border-radius: 50%;
            `}
          />
          <h1
            css={css`
              color: #000;
              font-size: 30px;
              font-weight: 500;
              margin: 0 0 0 10px;
            `}
          >
            {forum.name}
          </h1>
        </div>

        <TabList>
          <Link href={`/f/${forum.alias}`} passHref>
            <TabList.Tab isActive={tab === 'popular'}>熱門</TabList.Tab>
          </Link>
          <Link
            href={{
              pathname: `/f/${forum.alias}`,
              query: { latest: true },
            }}
            passHref
          >
            <TabList.Tab isActive={tab === 'latest'}>最新</TabList.Tab>
          </Link>
          <Link href={`/f/${forum.alias}/rule`} passHref>
            <TabList.Tab isActive={tab === 'rule'}>板規</TabList.Tab>
          </Link>
        </TabList>
      </Header>
    </>
  );
}

function IndexForumLayout() {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { latest } = modalParentLocation.query;

  return (
    <Header
      css={css`
        display: flex;
        align-items: center;
        border-radius: 4px 4px 0 0;
      `}
    >
      <TabList>
        <Link href="/f" passHref>
          <TabList.Tab isActive={!latest}>熱門</TabList.Tab>
        </Link>
        <Link
          href={{
            pathname: '/f',
            query: {
              latest: true,
            },
          }}
          passHref
        >
          <TabList.Tab isActive={latest}>最新</TabList.Tab>
        </Link>
      </TabList>
    </Header>
  );
}

function ForumDetail({ forum }) {
  const disclosure = useDisclosureState({ animated: true });
  const [style, ref] = useAnimateHeight(0);

  const hasTopics = forum.topics.length > 0;

  return (
    <div
      css={css`
        border-radius: 2px;
        background-color: #fff;
        padding: 20px;
        color: rgba(0, 0, 0, 0.6);
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Image
          src={forum.logo?.url ?? '/forum-logo-placeholder.svg'}
          width={20}
          height={20}
          alt="Logo"
          css={css`
            border-radius: 50%;
          `}
        />
        <h2
          css={css`
            color: #000;
            font-size: 20px;
            font-weight: 500;
            line-height: 1.6;
            margin: 0 0 0 10px;
          `}
        >
          {forum.name}
        </h2>
      </div>
      <div
        css={css`
          margin-top: 4px;
          line-height: 1.57;
        `}
      >
        <ForumPostsFrequency forum={forum} />
      </div>

      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={css`
            line-height: 1.57;
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
          `}
        >
          歡迎來到{forum.name}板。
        </span>
        {hasTopics && (
          <Disclosure
            {...disclosure}
            css={css`
              margin-left: auto;
              cursor: pointer;
            `}
          >
            <ArrowIcon
              css={css`
                width: 16px;
                height: 16px;
                fill: rgba(0, 0, 0, 0.6);
                transform: rotate(${disclosure.visible ? '180deg' : '0'});
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              `}
            />
            <VisuallyHidden>展開話題</VisuallyHidden>
          </Disclosure>
        )}
      </div>

      {hasTopics && (
        <DisclosureContent
          {...disclosure}
          css={css`
            overflow: hidden;
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            ${style}
          `}
          ref={ref}
        >
          <ul
            css={css`
              list-style: none;
              padding: 0;
              margin: 0;
            `}
          >
            {forum.topics.map((topic) => (
              <li
                key={topic}
                css={css`
                  display: inline-block;
                  margin: 8px 8px 0 0;

                  /**
                   * Add a zero-width space for a11y.
                   * See https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#Accessibility_concerns
                   */
                  &:before {
                    content: '\u200B';
                  }
                `}
              >
                <TopicTag>{topic}</TopicTag>
              </li>
            ))}
          </ul>
        </DisclosureContent>
      )}
    </div>
  );
}

function Forum({ children }) {
  const { forumAlias } = useParams();
  const forum = useForumByAlias(forumAlias);

  if (forumAlias && !forum) {
    return null;
  }

  return (
    <>
      <Head
        title={forum && `${forum.name}板`}
        images={
          forum
            ? [forum.heroImage?.url ?? '/forum-hero-placeholder.svg']
            : undefined
        }
      />

      {forum ? <ForumLayout forum={forum} /> : <IndexForumLayout />}

      {children}
    </>
  );
}

Forum.Aside = function Aside() {
  const { forumAlias } = useParams();
  const forum = useForumByAlias(forumAlias);

  if (!forum) {
    return null;
  }

  return <ForumDetail key={forum.alias} forum={forum} />;
};

Forum.prefetchQueries = async function prefetchQueries(queryClient, context) {
  const { forumAlias } = context.router.query;

  if (forumAlias) {
    const forums = await queryClient.fetchQuery('forums');

    const forum = Object.values(forums).find((f) => f.alias === forumAlias);

    if (!forum) {
      throw { statusCode: 404 };
    }

    setDehydratedForums(queryClient, {
      [forum.id]: forum,
    });
  }
};

export default Forum;
