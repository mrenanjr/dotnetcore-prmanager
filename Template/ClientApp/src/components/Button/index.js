import React from 'react';

import { Container } from './styles';

const Button = ({ children, loading, ...rest }) => (
  <Container {...rest}>{loading ? 'Carregando...' : children}</Container>
);

export default Button;