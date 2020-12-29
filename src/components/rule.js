import { useMemo } from 'react';
import Link from 'next/link';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import {
  setDehydratedForums,
  useForumByAlias,
} from '../hooks/use-forums-query';

function Moderators({ moderators }) {
  if (!moderators.length) {
    return null;
  }

  const [moderator] = moderators;

  return (
    <section
      css={css`
        && {
          margin-top: 0;
          padding-bottom: 30px;
          border-bottom: 1px solid rgb(222, 222, 222);
        }
      `}
    >
      <h2>管理人員</h2>

      <p>
        本看板由板主「
        <Link href={`/@${moderator.uid}`}>
          <a>{moderator.nickname}</a>
        </Link>
        」負責管理。
      </p>

      <p>
        若板主出現以下情形，請來信看板{' '}
        <a href="mailto:usersupport@dcard.cc">申訴信箱</a> 反應：
      </p>

      <div>
        <ol>
          <li>文章明顯違規，但板主未依照板規執法</li>
          <li>板主誤判違規文章，將當事人禁言</li>
          <li>板規含有攻擊、歧視，違反全站站規等不適當的內容</li>
          <li>板主連續多日未處理看板事務</li>
        </ol>
      </div>
    </section>
  );
}

function ForumRules({ forumName, forumRules }) {
  if (!forumRules.length) {
    return null;
  }

  return (
    <>
      <section>
        <h2>{forumName}板板規</h2>
        <p>
          若貼文內容違反規定，板主將透過管理後臺刪除貼文，貼文刪除的同時，系統會自動禁止發文者繼續於本看板發言。
          <br />
          歡迎交流《{forumName}》相關文章。
        </p>
      </section>
      <section>
        <ol>
          {forumRules.map((rule) => (
            <li key={rule.id}>
              <h2>{rule.title}</h2>
              {rule.content && <p>{rule.content}</p>}
              <p>違反此板規禁言 {rule.bucketDays} 天。</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function GlobalRules({ globalRules }) {
  if (!globalRules.length) {
    return null;
  }

  return (
    <>
      <section>
        <h2>全站站規</h2>
        <p>
          違反全站站規的貼文，板主刪文後系統會通知官方審核人員，依全站站規於全站停權使用者。
        </p>
      </section>
      <section>
        <ol>
          {globalRules.map((rule) => (
            <li key={rule.id}>
              <h2>{rule.title}</h2>
              {rule.content && <p>{rule.content}</p>}
              <p>違反此站規，於此看板禁言 {rule.bucketDays} 天。</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function Rule() {
  const router = useRouter();
  const { forumAlias } = router.query;

  const forum = useForumByAlias(forumAlias);
  const forumID = forum?.id;

  const { data: bulletin } = useQuery([`forums/bulletin`, { forumID }], {
    staleTime: Infinity,
  });

  const version = useMemo(() => {
    const date = new Date(bulletin?.lastUpdatedAt);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  }, [bulletin?.lastUpdatedAt]);

  if (!bulletin || !forum) {
    return null;
  }

  const { forumRules, globalRules, moderators } = bulletin;

  return (
    <div
      css={css`
        padding: 30px 60px;
        font-size: 16px;
        line-height: 1.56;
        color: rgba(0, 0, 0, 0.6);
        white-space: pre-wrap;

        section {
          margin-top: 30px;

          p {
            margin: 10px 0 0;
          }

          h2 {
            display: inline;
            font-size: 20px;
            font-weight: 500;
            line-height: 1.6;
            margin: 0;
            color: rgba(0, 0, 0, 0.6);
          }

          ol,
          ul {
            padding: 0;
            list-style-position: inside;
          }

          a {
            color: rgb(51, 151, 207);
          }

          > ol {
            color: rgba(0, 0, 0, 0.45);

            > li {
              padding-bottom: 8px;
              margin-top: 10px;
              border-bottom: 1px solid rgb(222, 222, 222);

              &:first-child {
                margin-top: 0;
              }

              &::marker {
                font-size: 20px;
                font-weight: 500;
                line-height: 1.6;
              }
            }
          }
        }
      `}
    >
      <Moderators moderators={moderators} />

      <section>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <h2>規範</h2>
          <span
            css={css`
              color: rgba(0, 0, 0, 0.35);
            `}
          >
            版本：{version}
          </span>
        </div>
        <p>
          於看板發言時請遵守全站站規與本板板規，讓大家都有一個乾淨的討論空間。
        </p>
      </section>

      <ForumRules forumName={forum.name} forumRules={forumRules} />

      <GlobalRules globalRules={globalRules} />
    </div>
  );
}

Rule.prefetchQueries = async function prefetchQueries(queryClient, context) {
  const { forumAlias } = context.router.query;
  const forums = await queryClient.fetchQuery('forums');
  const forum = Object.values(forums).find((f) => f.alias === forumAlias);

  const forumID = forum.id;

  await queryClient.prefetchQuery([`forums/bulletin`, { forumID }]);

  setDehydratedForums(queryClient, {
    [forum.id]: forum,
  });
};

export default Rule;
