import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiChevronLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Header, PRImg, SubHeader, Title, SubTitle } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';
import pullRequestSvg from '../../assets/pr.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignIn = () => {
    const formRef = useRef(null);
    
    const { addToast } = useToast();
    const { signIn } = useAuth();

    const history = useHistory();

    const handleSubmit = useCallback(
        async (data) => {
          try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password,
            });

            history.push('/databaserepositories');
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
                formRef.current?.setErrors(getValidationErrors(err));
      
                return;
              }
      
              addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description:
                  'Ocorreu um erro ao fazer login, cheque suas credenciais.',
              });
          }
        },
        [signIn, addToast, history],
      );

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        <Link to="/dashboard">
          <FiChevronLeft size={20}/>
          Voltar
        </Link>
      </Header>

      <SubHeader>
        <Title>Multi Repo PR Manager</Title>
      </SubHeader>

      <br/>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <SubTitle>Faça seu logon</SubTitle>
        <Input name="email" icon={FiMail} placeholder="Email" />
        <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
        />
        <Button type="submit">Entrar</Button>
        {/* <Link to="forgot-password">Esqueci minha senha</Link> */}
      </Form>
    </>
  );
}

export default SignIn;
