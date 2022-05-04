/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight, FiLogOut, FiLogIn, FiTrash2 } from 'react-icons/fi';
import { GET_REPOSITORY, PROFILE_QUERY } from '../../graphql/pullrequests-queries';

import { apolloClearCache } from '../../App';

import { Header, PRImg, SubHeader, Title, Form, Error, Repositories } from './styles';

import pullRequestSvg from '../../assets/pr.svg';

const Dashboard = () => {
  const history = useHistory();

  const [newToken, setNewToken] = useState('');
  const [messageError, setMessageError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [hasToken, setHasToken] = useState(() => {
    const token = localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);

    if(!token) {
      localStorage.removeItem('@PR-MANAGER:repositories');
    }

    return !!token;
  });
  const [repositories, setRepositories] = useState(() => {
    const storageRepositories = localStorage.getItem('@PR-MANAGER:repositories');

    if(storageRepositories) {
      return JSON.parse(storageRepositories);
    }

    return [];
  });
  const defaultMessage = 'A requisição há API retornou um erro.';
  const unauthorized = 'status code 401';
  const handleSuccessGetRepository = (repository) => {
    setHasToken(true);
    setMessageError('');

      if (repository) {
        setRepositories([...repositories, repository]);
    } else if (newRepo) {
        setMessageError('Nenhum repositório encontrado com este nome');
    }

    clearInputs();
  };
  const handleMessageError = (message) => {
    if (message.includes(unauthorized)) {
        setMessageError(`${defaultMessage} Não foi possível autorizar com o token informado.`)
        clearLocalStorage();
    } else {
        setMessageError(`${defaultMessage} Error: ${message}`)
    }

    clearInputs();
  };
  const [getRepositories] = useLazyQuery(GET_REPOSITORY, {
      variables: { name: '' },
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
          handleSuccessGetRepository(data?.viewer?.repository)
      },
      onError: ({ message }) => { handleMessageError(message) },
  });
  const [getProfile] = useLazyQuery(PROFILE_QUERY, {
      fetchPolicy: "no-cache",
      onCompleted: () => {
          setHasToken(true);
          setMessageError('');
      },
      onError: ({ message }) => { handleMessageError(message) },
  });

  useEffect(() => {
    if(repositories.length > 0) {
      localStorage.setItem(
        '@PR-MANAGER:repositories',
        JSON.stringify(repositories)
      );
    }
  }, [repositories]);

  const handleUseToken = (event) => {
    event.preventDefault();

    if(!newToken) {
      setMessageError('Coloque o token para autenticar na API do GitHub');
      clearInputs();
      return;
    }

    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME, newToken);

    getProfile();
  }

  const handleAddRepository = (event) => {
    event.preventDefault();

    if(!newRepo) {
      setMessageError('Digite o nome do repositório');
      clearInputs();
      return;
    }

    getRepositories({variables: { name: newRepo }});
  }

  const handleResetToken = (event) => {
    event.preventDefault();

    apolloClearCache();
    clearLocalStorage();
    clearInputs();
    setMessageError('');
  }

  const handleResetRepo = (event) => {
    event.preventDefault();

    clearRepo();
    apolloClearCache();
  }

  const handleRepositoryClick = (avatarUrl, repositoryName) => {
    localStorage.setItem('@PR-MANAGER:avatarUrl', avatarUrl);

    history.push(`/repositories/${repositoryName}`);
  }

  const clearLocalStorage = () => {
    clearRepo();
    localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);
    setHasToken(false);
  }

  const clearRepo = () => {
    localStorage.removeItem('@PR-MANAGER:repositories');
    setRepositories([]);
  }

  const clearInputs = () => {
    setNewToken('');
    setNewRepo('');
  }

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        {hasToken ?
          <a onClick={handleResetToken}>
              <FiLogOut size={20}/>
              Reset Token
          </a>
        :
          <Link to="/signin">
              <FiLogIn size={20} />
              Login
          </Link>
        }
      </Header>

      <SubHeader>
        <Title>Multi Repo PR Manager</Title>

        {repositories.length > 0 &&
          <a onClick={handleResetRepo}>
            <FiTrash2 size={20}/>
            Reset Repo
          </a>
        }
      </SubHeader>

      <Form hasError={!!messageError} onSubmit={!hasToken ? handleUseToken : handleAddRepository}>
        <input
          value={!hasToken ? newToken : newRepo}
          onChange={e => (!hasToken ? setNewToken(e.target.value) : setNewRepo(e.target.value))}
          placeholder={!hasToken ? 'Informe seu token de acesso' : 'Informe o seu repositório'}
        />
        <button type="submit">{!hasToken ? 'Usar' : 'Pesquisar'}</button>
      </Form>

      {messageError && <Error>{messageError}</Error>}

      <Repositories>
        {repositories &&
          repositories.map(repository => (
            <a key={repository.id} onClick={() => handleRepositoryClick(repository.owner.avatarUrl, repository.name)}>
              <img src={repository.owner.avatarUrl} alt={repository.owner.login} />

              <div>
                  <strong>{repository.nameWithOwner}</strong>
                  <p>{!!repository.description ? repository.description : "Sem descrição"}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
          )
        )}
      </Repositories>
    </>
  );
}

export default Dashboard;
