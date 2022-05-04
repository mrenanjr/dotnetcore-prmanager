using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Template.Application.Interfaces;
using Template.Application.ViewModels;
using Template.Domain.Entities;
using Template.Domain.Interfaces;

namespace Template.Application.Services
{
    public class PullRequestService : IPullRequestService
    {
        private readonly IPullRequestRepository _pullRequestRepository;
        private readonly IMapper _mapper;

        public PullRequestService(IPullRequestRepository pullRequestRepository, IMapper mapper)
        {
            _pullRequestRepository = pullRequestRepository;
            _mapper = mapper;
        }

        public List<PullRequestViewModel> Get()
        {
            IEnumerable<PullRequest> _prs = _pullRequestRepository.GetAll();

            List<PullRequestViewModel> _prsViewModels = _mapper.Map<List<PullRequestViewModel>>(_prs);

            return _prsViewModels;
        }

        public PullRequestViewModel GetById(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new Exception("PullRequestID is not valid");

            PullRequest pr = _pullRequestRepository.Find(x => x.Id == id && !x.IsDeleted);
            if (pr == null)
                throw new Exception("PullRequest not found");

            return _mapper.Map<PullRequestViewModel>(pr);
        }

        public bool Post(PullRequestViewModel pullRequestViewModel)
        {
            Validator.ValidateObject(pullRequestViewModel, new ValidationContext(pullRequestViewModel), true);

            PullRequest _prs = _mapper.Map<PullRequest>(pullRequestViewModel);

            _pullRequestRepository.Create(_prs);

            return true;
        }

        public bool Delete()
        {
            _pullRequestRepository.DeleteAll(x => !x.IsDeleted);

            return true;
        }
    }
}
