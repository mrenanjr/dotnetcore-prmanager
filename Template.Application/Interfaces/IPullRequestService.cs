using System;
using System.Collections.Generic;
using System.Text;
using Template.Application.ViewModels;

namespace Template.Application.Interfaces
{
    public interface IPullRequestService
    {
        List<PullRequestViewModel> Get();
        PullRequestViewModel GetById(string id);
        bool Post(PullRequestViewModel pullRequestViewModel);
        bool Delete();
    }
}
