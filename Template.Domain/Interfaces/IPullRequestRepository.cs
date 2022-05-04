using System;
using System.Collections.Generic;
using System.Text;
using Template.Domain.Entities;

namespace Template.Domain.Interfaces
{
    public interface IPullRequestRepository : IRepository<PullRequest>
    {
        IEnumerable<PullRequest> GetAll();
    }
}
