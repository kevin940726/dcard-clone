import styled from 'styled-components';

// TODO: Use Reakit's Tab component
const Tab = styled.a.attrs({
  tabIndex: 0,
})`
  color: ${(props) => (props.isActive ? '#000' : 'rgba(0, 0, 0, 0.35)')};
  height: 60px;
  padding: 0 16px;
  line-height: 60px;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  cursor: pointer;

  &:hover {
    color: #000;
  }

  &:after {
    content: ${(props) => (props.isActive ? '""' : 'none')};
    border-bottom: 2px solid rgb(51, 151, 207);
    position: absolute;
    left: 0px;
    bottom: -1px;
    width: 100%;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const TabList = styled.div`
  display: flex;
`;

TabList.Tab = Tab;

export default TabList;
