using System.ComponentModel.DataAnnotations;
namespace AngularProject.Server.Models
{
    public class Supplier
    {
        [Key]
        public int supplier_id { get; set; }
        public string supplier_name { get; set; }
    }
}
