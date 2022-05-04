import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    display: flex;
    align-items: center;
    color: #a8a8b3;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }

    svg {
      margin-right: 4px;
    }
  }
`;

export const PRImg = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 22px;
    margin-right: 20px;
  }

  strong {
    font-weight: bold;
  }
`;

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 700px;

  a {
    display: flex;
    align-items: center;
    color: #c53030 !important;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #902323 !important;
    }

    svg {
      margin-right: 4px;
    }
  }
`;

export const Title = styled.h1`
  font-size: 48px;
  color: #3A3A3A;
  max-width: 450px;
  line-height: 56px;

  margin-top: 80px;
`;

export const SubTitle = styled.h1`
  font-size: 36px;
  color: #3A3A3A;
  max-width: 450px;
  line-height: 56px;

  margin-top: 20px;
`;