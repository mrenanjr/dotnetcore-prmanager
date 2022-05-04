using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Template.Application.ViewModels
{
    public class PullRequestViewModel
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Login { get; set; }
        public string State { get; set; }
        public string Url { get; set; }
    }
}
