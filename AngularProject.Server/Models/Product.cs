using System.ComponentModel.DataAnnotations;

namespace AngularProject.Server.Models
{
    public class Product
    {
        [Key]
        public int product_id { get; set; }
        public string product_name { get; set; }
        public int product_inventory { get; set; }
        public DateTime product_warranty { get; set; }
        public int supplier_id  { get; set; }
        public int product_saleprice { get; set; }
        public int product_inprice { get; set; }
        public string product_description   { get; set; }
        public int type_id  { get; set; }
        public string product_image { get; set; }
        public int is_deleted { get; set; }

    }
}
