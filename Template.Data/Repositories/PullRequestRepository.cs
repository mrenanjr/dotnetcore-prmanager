using System;
using System.Collections.Generic;
using System.Text;
using Template.Data.Context;
using Template.Domain.Entities;
using Template.Domain.Interfaces;

namespace Template.Data.Repositories
{
    public class PullRequestRepository : Repository<PullRequest>, IPullRequestRepository
    {
        public PullRequestRepository(CoreContext context) : base(context) { }

        public IEnumerable<PullRequest> GetAll() => Query(x => !x.IsDeleted);
    }
}