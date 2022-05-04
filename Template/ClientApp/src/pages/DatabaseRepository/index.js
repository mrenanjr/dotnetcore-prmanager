import { useEffect, useState } from 'react';
import { FiLogOut, FiChevronRight, FiTrash2 } from 'react-icons/fi';

import { Header, PRImg, PullRequests, SubHeader, Title } from './styles';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast'

import api from '../../services/api';
import pullRequestSvg from '../../assets/pr.svg';

const DatabaseRepository = () => {
  const { signOut, user } = useAuth();
  const { addToast } = useToast();

  const [pullRequests, setPullRequests] = useState([]);

  useEffect(() => {
    api
      .get(`/api/pullrequests`)
      .then(response => {
        setPullRequests([...pullRequests, ...response.data]);
      });
  }, [user.id]);

  const handleResetRepo = async (event) => {
    event.preventDefault();

    try {
      await api.delete('/api/pullrequests');

      setPullRequests([]);

      addToast({
        type: 'success',
        title: 'Dados removidos com sucesso!'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Não foi possível remover os dados a base',
        description: 'Ocorreu um erro ao tentar remover o PR da base, tente novamente mais tarde.',
      });
    }
  }

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Database Pull Request</strong>
        </PRImg>

        <button type="button" onClick={signOut}>
          <FiLogOut size={20}/>
          Sair
        </button>
      </Header>

      <SubHeader>
        <Title>Bem vindo {user.name}</Title>

        {pullRequests.length > 0 &&
          <a onClick={handleResetRepo}>
            <FiTrash2 size={20}/>
            Reset Repo
          </a>
        }
      </SubHeader>

      <PullRequests>
        {pullRequests &&
          pullRequests.map(pullRequest => (
            <a key={pullRequest.id} target="_blank" href={`${pullRequest.url}`} rel="noreferrer">
              <img src={pullRequestSvg}  alt="Pull request SVG"></img>

              <div>
                  <strong>{pullRequest.title}</strong>
                  <p>{pullRequest.login}</p>
                  <p>{pullRequest.state}</p>
                  <strong>{pullRequest.url}</strong>
              </div>

              <FiChevronRight size={20} />
            </a>
          ))
        }
      </PullRequests>
    </>
  );
}

export default DatabaseRepository;
