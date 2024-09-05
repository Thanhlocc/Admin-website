using System.ComponentModel.DataAnnotations;
namespace AngularProject.Server.Models
{
    public class Product_type
    {
        [Key]
        public int type_id { get; set; }
        public string type_name { get; set; }
    }
}
