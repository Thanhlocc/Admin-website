import { CommonModule,  } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { ProductService, Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { Supplier, SupplierService } from '../../services/supplier.service';
import { Producttype, ProducttypeService } from '../../services/producttype.service';
declare var bootstrap: any;
@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  public products: Product[] = [];
  public suppliers: Supplier[] = [];
  public producttypes: Producttype[] = [];
  constructor(private productService: ProductService, private supplierService: SupplierService, private producttypeService: ProducttypeService) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        (products) => {
          this.products = products;
          console.log(products);
        },
        (error) => {
          console.log('Error fetching products', error);
        }
    );
    this.supplierService.getSuppliers()
      .subscribe(
        (suppliers) => {
          this.suppliers = suppliers;
          console.log(suppliers);
        },
        (error) => {
          console.log('Error fetching suppliers', error);
        }
    );
    this.producttypeService.getProducttypes()
      .subscribe(
        (producttypes) => {
          this.producttypes = producttypes;
          console.log(producttypes);
        },
        (error) => {
          console.log('Error fetching producttypes', error);
        }
      );
  }
  openSettingsModal() {
    this.resetProductObj();
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {
      backdrop: 'static',
      keyboard: false
    });
    settingsModal.show();
  }
  openModalSupplier() {
    const supplierModal = new bootstrap.Modal(document.getElementById('supplierModal')!, {
      backdrop: 'static',
      keyboard: false
    });
    supplierModal.show();
  }

  openModalCate() {
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal')!, {
      backdrop: 'static',
      keyboard: false
    });
    categoryModal.show();
  }
  openModalPutProduct(productId: number) {
    this.productService.getProductById(productId).subscribe(
      (product: Product) => {
        this.productObj = product; // Gán dữ liệu sản phẩm vào productObj
        this.imagePreviewUrl = this.productObj.productImage;
        // Hiển thị ảnh nếu có
        // Hiển thị modal sửa sản phẩm
        const putProductModal = new bootstrap.Modal(document.getElementById('putProductModal')!, {
          backdrop: 'static',
          keyboard: false
        });
        putProductModal.show();
        // Lắng nghe sự kiện khi modal bị đóng
        const modalElement = document.getElementById('putProductModal')!;
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.resetProductObj(); // Đặt lại productObj khi modal bị đóng
        }, { once: true }); // Đảm bảo chỉ lắng nghe một lần để tránh sự kiện bị lặp lại
      
      },
      (error) => {
        console.error('Error fetching product details', error);
        alert('Đã xảy ra lỗi khi lấy thông tin sản phẩm.');
      }
    );
    
  }
  productImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.productImage = event.target.files[0];

      if (this.productImage) { // Kiểm tra productImage không phải là null
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.imagePreviewUrl = e.target?.result as string;
          // Đảm bảo rằng result là string
        };
        reader.readAsDataURL(this.productImage); // Đọc tệp hình ảnh dưới dạng URL Data
      }
    }
  }
  productObj: any = {
    "product_id": 0,  
    "product_name": "",  
    "product_inventory": 0,  
    "product_saleprice": 0,
    "product_inprice": 0,
    "supplier_id": 0,
    "type_id": 0,
    "product_description": "",  
    is_deleted: 0,
    product_warranty: ''
    
  }
  onSubmit() {
    
    // Hiển thị thông tin ra console
    console.log('Product Object:');

    console.log('  Name:', this.productObj.product_name);
    console.log('  Inventory:', this.productObj.product_inventory);
    console.log('  Sale Price:', this.productObj.product_saleprice);
    console.log('  In Price:', this.productObj.product_inprice);
    console.log('  Supplier ID:', this.productObj.supplier_id);
    console.log('  Type ID:', this.productObj.type_id);
    console.log('  Description:', this.productObj.product_description);
    
    console.log('Product Image:', this.productImage );
    // Cập nhật product_warranty với ngày và giờ hiện tại
    this.productObj.product_warranty = new Date().toISOString();

    // Tạo FormData
    const formData = new FormData();

    // Thêm dữ liệu vào FormData
    formData.append('product_name', this.productObj.product_name);
    formData.append('product_inventory', this.productObj.product_inventory.toString());
    formData.append('product_saleprice', this.productObj.product_saleprice.toString());
    formData.append('product_inprice', this.productObj.product_inprice.toString());
    formData.append('supplier_id', this.productObj.supplier_id.toString());
    formData.append('type_id', this.productObj.type_id.toString());
    formData.append('product_description', this.productObj.product_description);
    formData.append('product_warranty', this.productObj.product_warranty);
    console.log('  Warranty:', this.productObj.product_warranty);
    // Thêm hình ảnh vào FormData
    if (this.productImage) {
      formData.append('product_image', this.productImage);
    }
    console.log('Product Image:', this.productImage);

    // Gửi yêu cầu POST với FormData
    this.productService.addProduct(formData).subscribe(
      (res: any) => {
        if (res.result) {
          alert('Thêm sản phẩm thành công');
          window.location.reload();
        } else {
          alert('Thất bại');
        }
      }
    );
    
  }
  supplierObj: any = {
    "supplier_id": 0,
    "supplier_name": ""
  }
  product_typeObj: any = {
    "type_id": 0,
    "type_name": ""
  }
  onSubmitSupplier() {
    this.supplierService.addSupplier(this.supplierObj).subscribe((res: any) => {
      if (res.result) {
        alert("Thêm nhà cung cấp thành công");
        
        window.location.reload();
      } else {
        console.log(this.supplierObj)
        alert("Thất bại")
      }
    })
  }
  onSubmitPutProduct() {
    
    // Cập nhật product_warranty với ngày và giờ hiện tại (nếu cần thiết)
    this.productObj.product_warranty = new Date().toISOString();

    // Tạo FormData
    const formData = new FormData();

    // Thêm dữ liệu vào FormData
    formData.append('product_id', this.productObj.product_id.toString());
    formData.append('product_name', this.productObj.product_name);
    formData.append('product_inventory', this.productObj.product_inventory.toString());
    formData.append('product_saleprice', this.productObj.product_saleprice.toString());
    formData.append('product_inprice', this.productObj.product_inprice.toString());
    formData.append('supplier_id', this.productObj.supplier_id.toString());
    formData.append('type_id', this.productObj.type_id.toString());
    formData.append('product_description', this.productObj.product_description);
    formData.append('product_warranty', this.productObj.product_warranty);

    // Kiểm tra và thêm hình ảnh vào FormData (nếu có hình ảnh mới được chọn)
    if (this.productImage) {
      formData.append('product_image', this.productImage);
    }

    // Gửi yêu cầu PUT để cập nhật sản phẩm
    this.productService.updateProduct(this.productObj.product_id, formData).subscribe(
      (res: any) => {
        if (res.result) {
          alert('Sửa sản phẩm thành công');
          window.location.reload(); // Tải lại trang sau khi sửa thành công
        } else {
          alert('Sửa sản phẩm thất bại');
        }
      },
      (error) => {
        console.error('Error updating product', error);
        alert('Đã xảy ra lỗi khi sửa sản phẩm.');
      }
    );
  }
  onSubmitCate() {
    this.producttypeService.addProducttype(this.product_typeObj).subscribe((res: any) => {
      if (res.result) {
        alert("Thêm danh mục thành công");
        window.location.reload();
      } else {
        console.log(this.supplierObj)
        alert("Thất bại")
      }
    })
  }
  deleteProduct(productId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          // Xóa sản phẩm khỏi danh sách hiện tại
          this.products = this.products.filter(product => product.product_id !== productId);
          alert('Sản phẩm đã được xóa thành công!');
        },
        (error) => {
          console.error('Error deleting product', error);
          alert('Đã xảy ra lỗi khi xóa sản phẩm.');
        }
      );
    }
  }
  resetProductObj() {
    this.productObj = {
      product_id: 0,
      product_name: '',
      product_inventory: 0,
      product_saleprice: 0,
      product_inprice: 0,
      supplier_id: 0,
      type_id: 0,
      product_description: '',
      is_deleted: 0,
      product_warranty: '',
      product_image: ''
    };
    this.imagePreviewUrl = null; // Đặt lại hình ảnh preview
    // Reset input file
    const fileInput = document.querySelector('#putProductModal input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset giá trị input file
    }
  }

}
