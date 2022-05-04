using System;
using System.Collections.Generic;
using System.Text;
using Template.Domain.Models;

namespace Template.Domain.Entities
{
    public class PullRequest : Entity
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Login { get; set; }
        public string State { get; set; }
        public string Url { get; set; }
    }
}
