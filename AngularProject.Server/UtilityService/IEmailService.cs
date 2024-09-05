using AngularProject.Server.Models;
using System;

namespace AngularProject.Server.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
