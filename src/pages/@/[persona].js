import { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Head from '../../components/head';
import PersonaPostsList from '../../components/persona-posts-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Avatar from '../../components/avatar';
import useModalParentLocation from '../../hooks/use-modal-parent-location';

function PersonaInfo() {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { persona } = modalParentLocation.query;

  const { data: personaInfo } = useQuery(`personas/${persona}`, {
    staleTime: Infinity,
  });

  if (!personaInfo) {
    return null;
  }

  const {
    gender,
    nickname,
    postAvatar,
    postCount,
    subscriptionCount,
  } = personaInfo;

  return (
    <header
      css={css`
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        margin: 14px 0 24px;
      `}
    >
      <Head title={`${nickname} (@${persona}) 的公開頁面`} />

      <Avatar
        gender={gender}
        nickname={persona}
        postAvatar={postAvatar}
        size={60}
        css={css`
          margin: 0 12px;
        `}
      />
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h1
          css={css`
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
            color: #000;
            margin: 0;
          `}
        >
          {nickname}
        </h1>
        <h2
          css={css`
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.35);
            margin: 0;
          `}
        >
          @{persona}
        </h2>
        <div
          css={css`
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.35);
          `}
        >
          {postCount} 篇文章<span aria-hidden="true">・</span>
          {subscriptionCount} 位粉絲
        </div>
      </div>
    </header>
  );
}

function PersonaPage() {
  return (
    <>
      <PersonaInfo />

      <PersonaPostsList />
    </>
  );
}

PersonaPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { persona } = context.router.query;

  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    // Use fetchQuery to catch the errors
    queryClient.fetchQuery(`personas/${persona}`),
    PersonaPostsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout
    {...props}
    css={css`
      background-color: rgb(242, 243, 244);
      border-radius: 12px;
      padding: 20px 60px;
      width: 760px;
    `}
  >
    {children}
  </Layout>
))(PersonaPage);
