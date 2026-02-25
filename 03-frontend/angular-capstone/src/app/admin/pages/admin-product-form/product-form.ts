import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminProductService } from '../../services/admin-product-service';
import { AdminCategoryService } from '../../services/admin-category-service';

import { AdminCategory } from '../../models/admin-category';
import { AdminProduct } from '../../models/admin-product';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './product-form.html',
  standalone: false,
})
export class ProductForm implements OnInit {
  loading = false;
  saving = false;
  uploading = false;
  errorMsg = '';
  successMsg = '';
  private clearMessages(): void {
    this.errorMsg = '';
    this.successMsg = '';
  }

  productForm!: FormGroup;

  editMode = false;
  productId: number | null = null;

  categories: AdminCategory[] = [];

  // file upload state
  selectedFile: File | null = null;
  existingImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: AdminProductService,
    private categoryService: AdminCategoryService,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      unitsInStock: [0, [Validators.required, Validators.min(0)]],
      active: [true, [Validators.required]],
      sku: [''],
      categoryId: [null as number | null, [Validators.required]],
    });
    this.loadCategories();

    // determine create vs edit based on route param
    const idParam = this.route.snapshot.paramMap.get('id');
    this.editMode = !!idParam;

    if (this.editMode) {
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
    }
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data ?? []),
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to load categories.';
        console.error('GET categories failed:', err);
      },
    });
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getById(id).subscribe({
      next: (p) => {
        this.loading = false;
        this.patchFormFromProduct(p);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'Failed to load product.';
        console.error('GET product failed:', err);
      },
    });
  }

  private patchFormFromProduct(p: AdminProduct): void {
    this.productForm.patchValue({
      name: p.name ?? '',
      description: p.description ?? '',
      unitPrice: p.unitPrice ?? 0,
      unitsInStock: p.unitsInStock ?? 0,
      active: !!p.active,
      sku: p.sku ?? '',
      categoryId: p.category?.id ?? null,
    });

    this.existingImageUrl = p.imageUrl ?? null;
  }

  save(): void {
  this.clearMessages();

  const isCreate = !this.editMode;
  const hasNewImage = !!this.selectedFile;
  const hasExistingImage = !!this.existingImageUrl;

  // New product must have an image
  if (isCreate && !hasNewImage) {
    this.errorMsg = 'Please choose an image before saving.';
    return;
  }

  // Edit product must have either existing image OR new image
  if (!isCreate && !hasNewImage && !hasExistingImage) {
    this.errorMsg = 'This product needs an image. Please choose a file before saving.';
    return;
  }

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  const v = this.productForm.value;

  const payload: any = {
    name: (v.name ?? '').trim(),
    description: (v.description ?? '').trim(),
    unitPrice: Number(v.unitPrice),
    unitsInStock: Number(v.unitsInStock),
    active: !!v.active,
    sku: (v.sku ?? '').trim() || null,
    category: { id: Number(v.categoryId) },
  };

  this.saving = true;

  if (this.editMode && this.productId != null) {
    this.productService.update(this.productId, payload).subscribe({
      next: () => {
        this.saving = false;

        // Only upload if user picked a new file
        if (hasNewImage) {
          this.uploadSelectedFileForProduct(this.productId!);
        } else {
          this.successMsg = '✅ Product updated successfully. Redirecting…';
          setTimeout(() => this.router.navigate(['/admin/products']), 700);
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message ?? 'Failed to update product.';
        console.error('PUT product failed:', err);
      },
    });
  } else {
    this.productService.create(payload).subscribe({
      next: (created) => {
        this.saving = false;

        const newId = created?.id;
        if (!newId) {
          this.errorMsg = 'Product was created but no ID was returned. Cannot upload image.';
          return;
        }

        // For new product, image is required, so always upload
        this.uploadSelectedFileForProduct(newId);
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message ?? 'Failed to create product.';
        console.error('POST product failed:', err);
      },
    });
  }
}


  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length ? input.files[0] : null;
  }

  private uploadSelectedFileForProduct(productId: number): void {
    if (!this.selectedFile) return;

    this.uploading = true;

    this.productService.uploadImage(productId, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;

        // success banner at top
        this.successMsg = '✅ Product saved and image upload successful. Redirecting…';

        // optional: clear selected file so user doesn’t accidentally re-upload
        this.selectedFile = null;

        // navigate to a sensible place (recommended: all products)
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 900);
      },
      error: (err) => {
        this.uploading = false;
        this.errorMsg = err?.error?.message ?? 'Image upload failed.';
        console.error('POST image failed:', err);

        // still navigate somewhere sensible if you want, or keep them here to retry
        // (I’d keep them here so they can try again.)
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
