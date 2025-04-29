using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace sdt_backend.net.Controllers
{
    public class FrontendController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/html");
        }
    }
}
