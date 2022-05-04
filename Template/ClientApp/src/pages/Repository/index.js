/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiClipboard, FiDatabase } from 'react-icons/fi';
import { useQuery } from '@apollo/client';
import { GET_PULLREQUESTS } from '../../graphql/pullrequests-queries';

import { Header, PRImg, RepositoryInfo, PullRequests, PullR } from './styles';

import pullRequestSvg from '../../assets/pr.svg';
import api from '../../services/api';
import { useToast } from '../../hooks/toast'

const Repository = () => {
  const { params } = useRouteMatch('');
  const { addToast } = useToast();
  const history = useHistory();

  const avatarUrl = localStorage.getItem('@PR-MANAGER:avatarUrl');
  const [colaborators, setColaborators] = useState(0);
  const [forks, setForks] = useState(0);
  const [issues, setIssues] = useState(0);
  const [pullRequestsCount, setPullRequestsCount] = useState(0);
  const [description, setDescription] = useState('');

  const [pullRequests, setPullRequests] = useState([]);
  const [pullRequestsInDB, setPullRequestsInDB] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState('');

  const { data, refetch } = useQuery(GET_PULLREQUESTS, {
    variables: { name: params.repository, first: 5, after: null },
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if(data) {
      const repository = data.viewer.repository;
      setColaborators(repository.collaborators.totalCount);
      setIssues(repository.issues.totalCount);
      setDescription(repository.description);
      setForks(repository.forkCount);

      if(repository.pullRequests) {
        setPullRequestsCount(repository.pullRequests.totalCount);
        setHasNextPage(repository.pullRequests.pageInfo.hasNextPage);
        setEndCursor(repository.pullRequests.pageInfo.endCursor);
        setPullRequests([...pullRequests, ...repository.pullRequests.nodes]);
      }
    }
  }, [data]);

  useEffect(() => {
    api
      .get(`/api/pullrequests`)
      .then(response => {
        setPullRequestsInDB([ ...pullRequestsInDB, ...response.data.map(m => m.id) ]);
      });
  }, []);

  useEffect(() => {
    if(pullRequests && pullRequestsInDB) {
      const ids = pullRequestsInDB.map(m => m.id);
      
      pullRequests.map(m => {
        var insideDb = ids.includes(m.id);
        
        return insideDb ? { ...m, insideDb } : m;
      });

    }
  }, [pullRequests, pullRequestsInDB]);

  const handleCopyLinks = () => {
    const textField = document.createElement('textarea');

    textField.innerHTML = pullRequests.map(pr => pr.url).join('\r\n');
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  const handleNextPage = (event) => {
    event.preventDefault();

    refetch({
      name: params.repository,
      first: 5,
      after: endCursor
    })
  };

  const handlePRToDatabase = async (id) => {
    try {
      const data = pullRequests.find(f => f.id === id);
      data.login = data.author?.login;

      await api.post('/api/pullrequests', data);

      addToast({
        type: 'success',
        title: 'Dados enviados com sucesso!'
      });

      setPullRequestsInDB([...pullRequestsInDB, data.id ]);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Não foi possível adicionar os dados a base',
        description: 'Ocorreu um erro ao enviar os dados do PR a base, tente novamente mais tarde.',
      });
    }
  };

  const handleVoltar = (event) => {
    event.preventDefault();
    localStorage.removeItem('@PR-MANAGER:avatarUrl');
    history.push('/dashboard');
  };

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        <a onClick={handleVoltar}>
          <FiChevronLeft size={20}/>
          Voltar
        </a>
      </Header>

      <RepositoryInfo>
        <header>
          <img src={avatarUrl} alt="Avatar image"></img>
          <div className="infoContainer">
            <div className="info">
              <strong>{params.repository}</strong>
              <p>{!!description ? description : "Sem descrição"}</p>
            </div>

            {pullRequests &&
              <a onClick={handleCopyLinks}>
                <FiClipboard size={20}/>
                Copy Links
              </a>
            }
          </div>
        </header>

        <ul>
          <li>
            <strong>{colaborators}</strong>
            <span>Colaboradores</span>
          </li>
          <li>
            <strong>{forks}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{issues}</strong>
            <span>Issues abertas</span>
          </li>
          <li>
            <strong>{pullRequestsCount}</strong>
            <span>{pullRequestsCount > 1 ? "Pull Requests" : "Pull Request"} </span>
          </li>
        </ul>
      </RepositoryInfo>

      <PullRequests>
        {pullRequests &&
          pullRequests.map(pullRequest => (
            <PullR
              key={pullRequest.id}
              onClick={() => handlePRToDatabase(pullRequest.id)}
              inDB={pullRequestsInDB.includes(pullRequest.id)}
            >
              <img src={pullRequestSvg}  alt="Pull request SVG"></img>

              <div>
                  <strong>{pullRequest.title}</strong>
                  <p>{pullRequest.author.login}</p>
                  <p>{pullRequest.state}</p>
                  <strong>{pullRequest.url}</strong>
              </div>

              <FiDatabase size={20} />
            </PullR>
          ))
        }
        {hasNextPage &&
          <a className="next" onClick={handleNextPage}>
            <FiChevronRight size={20}/>
            Next
          </a>
        }
      </PullRequests>
    </>
  );
}

export default Repository;
