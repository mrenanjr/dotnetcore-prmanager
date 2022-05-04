using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Application.Interfaces;
using Template.Application.ViewModels;

namespace Template.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class PullRequestsController : ControllerBase
    {
        private readonly IPullRequestService _pullRequestService;

        public PullRequestsController(IPullRequestService pullRequestService)
        {
            _pullRequestService = pullRequestService;
        }

        [HttpGet, AllowAnonymous]
        public IActionResult Get() => Ok(_pullRequestService.Get());

        [HttpPost, AllowAnonymous]
        public IActionResult Post(PullRequestViewModel pullRequestViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(_pullRequestService.Post(pullRequestViewModel));
        }

        [HttpDelete]
        public IActionResult Delete() => Ok(_pullRequestService.Delete());
    }
}
