﻿namespace AngularProject.Server.Models
{
    public class RegisterDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string Address { get; set; } 
        public DateTime CreatedDate { get; set; }
    }
}
