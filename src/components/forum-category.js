import { useState, useEffect } from 'react';
import { css } from 'styled-components';
import { useQuery } from 'react-query';
import { useDisclosureState, Disclosure, DisclosureContent } from 'reakit';
import { useForumsQuery } from '../hooks/use-forums-query';
import useAnimateHeight from '../hooks/use-animate-height';
import ArrowIcon from './arrow-icon';
import ForumItem from './forum-item';

function CategoryItem({
  name,
  id,
  forums,
  expandedCategory,
  setExpandedCategory,
}) {
  const isActive = id === expandedCategory;
  const disclosure = useDisclosureState({ visible: isActive, animated: true });
  const { visible, show, hide } = disclosure;

  useEffect(() => {
    if (isActive) {
      show();
    } else {
      hide();
    }
  }, [isActive, show, hide]);

  const { data: category } = useQuery(
    ['forums/categorization/category', { categoryID: id }],
    { enabled: isActive }
  );

  const [style, ref] = useAnimateHeight();

  return (
    <>
      <Disclosure
        {...disclosure}
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          line-height: 48px;
          padding: 16px;
          cursor: pointer;
        `}
        toggle={() => {
          setExpandedCategory(isActive ? null : id);
        }}
      >
        <h2
          css={css`
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.75);
            margin: 0;
          `}
        >
          {name}
        </h2>
        <ArrowIcon
          width={18}
          height={18}
          css={css`
            fill: rgba(0, 0, 0, 0.5);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;
            transform: rotate(${visible ? 180 : 0}deg);
            margin: 3px;
          `}
        />
      </Disclosure>
      <DisclosureContent
        {...disclosure}
        css={css`
          overflow: hidden;
          transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          ${style}
        `}
        ref={ref}
      >
        {!!category && (
          <ul
            css={css`
              display: flex;
              flex-direction: column;
              list-style: none;
            `}
          >
            {category.forumIds.map((forumID) => (
              <ForumItem key={forumID} forum={forums[forumID]} />
            ))}
          </ul>
        )}
      </DisclosureContent>
    </>
  );
}

function ForumCategory() {
  const { data: forums } = useForumsQuery();
  const { data: categorization } = useQuery('forums/categorization', {
    staleTime: Infinity,
  });

  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!categorization) {
    return null;
  }

  return (
    <div
      css={css`
        padding: 20px 60px;
      `}
    >
      <h1
        css={css`
          font-weight: 500;
          font-size: 28px;
          color: #000;
          line-height: 60px;
          margin: 0px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        `}
      >
        看板分類
      </h1>
      <ul
        css={css`
          display: flex;
          margin-top: 10px;
          flex-direction: column;
          list-style: none;
        `}
      >
        {categorization.map((category) => (
          <li key={category.id}>
            <CategoryItem
              id={category.id}
              name={category.name}
              forums={forums}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

ForumCategory.prefetchQueries = async function prefetchQueries(queryClient) {
  await queryClient.prefetchQuery('forums/categorization');
};

export default ForumCategory;
