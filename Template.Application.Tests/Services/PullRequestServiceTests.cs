using AutoMapper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Template.Application.AutoMapper;
using Template.Application.Services;
using Template.Application.ViewModels;
using Template.Domain.Entities;
using Template.Domain.Interfaces;
using Xunit;

namespace Template.Application.Tests.Services
{
    public class PullRequestServiceTests
    {
        private PullRequestService _pullRequestService;
        private IMapper _mapper;

        public PullRequestServiceTests()
        {
            var autoMapperProfile = new AutoMapperSetup();
            var configuration = new MapperConfiguration(x => x.AddProfile(autoMapperProfile));
            _mapper = new Mapper(configuration);
            _pullRequestService = new PullRequestService(new Mock<IPullRequestRepository>().Object, _mapper);
        }

        [Fact]
        public void Post_SendingValidObject()
        {
            var result = _pullRequestService.Post(new PullRequestViewModel { Id = "Id", Title = "Title" });
            Assert.True(result);
        }

        [Fact]
        public void Get_ValidatingObject()
        {
            List<PullRequest> prs = new List<PullRequest>
            {
                new PullRequest {
                    Id = "Id",
                    Title = "Title",
                    Login = "Login",
                    State = "State",
                    Url = "Url",
                    CreatedDate = DateTime.Now
                }
            };

            var pullRequestRepository = new Mock<IPullRequestRepository>();
            pullRequestRepository.Setup(x => x.GetAll()).Returns(prs);

            _pullRequestService = new PullRequestService(pullRequestRepository.Object, _mapper);

            var result = _pullRequestService.Get();

            Assert.True(result.Count > 0);
        }

        [Fact]
        public void Delete_ValidObject()
        {
            var id = "Id";
            List<PullRequest> prs = new List<PullRequest>
            {
                new PullRequest {
                    Id = id,
                    Title = "Title",
                    Login = "Login",
                    State = "State",
                    Url = "Url",
                    IsDeleted = false,
                    CreatedDate = DateTime.Now
                }
            };

            var pullRequestRepository = new Mock<IPullRequestRepository>();
            pullRequestRepository.Setup(x => x.DeleteAll(x => !x.IsDeleted)).Returns(true);
            pullRequestRepository.Setup(x => x.Find(x => x.Id == id && !x.IsDeleted)).Returns((PullRequest)null);

            _pullRequestService = new PullRequestService(pullRequestRepository.Object, _mapper);

            var result = _pullRequestService.Delete();

            Assert.True(result);

            var exception = Assert.Throws<Exception>(() => _pullRequestService.GetById(id));

            Assert.Equal("PullRequest not found", exception.Message);
        }
    }
}
