import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCategoryService } from '../../services/admin-category-service';
import { AdminCategory } from '../../models/admin-category';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  
  standalone: false,
})
export class CategoryList implements OnInit {
  categories: AdminCategory[] = [];
  loading = false;
  saving = false;
  errorMsg = '';
  editingId: number | null = null;
editName = '';


  categoryForm: FormGroup;

  constructor(
    private categoryService: AdminCategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMsg = '';

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message ??
          'Failed to load categories. Check backend, SSL trust, and CORS.';
        console.error('GET categories failed:', err);
      },
    });
  }
//add category
  createCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const name = (this.categoryForm.value.categoryName ?? '').trim();
    if (!name) return;

    this.saving = true;
    this.errorMsg = '';

    this.categoryService.create({ categoryName: name }).subscribe({
      next: () => {
        this.categoryForm.reset();
        this.saving = false;
        this.loadCategories(); // simplest refresh
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message ?? 'Failed to create category.';
        console.error('POST category failed:', err);
      },
    });
  }

  trackById(_: number, item: AdminCategory): number {
    return item.id;
  }

  //delete category
  deleteCategory(c: AdminCategory): void {
  const ok = confirm(`Delete category "${c.categoryName}"?`);
  if (!ok) return;

  this.saving = true;
  this.errorMsg = '';

  this.categoryService.delete(c.id).subscribe({
    next: () => {
      this.saving = false;
      this.loadCategories();
    },
    error: (err) => {
      this.saving = false;
      this.errorMsg = err?.error?.message ?? 'Failed to delete category.';
      console.error('DELETE category failed:', err);
    },
  });
}

//put
startEdit(c: AdminCategory): void {
  this.editingId = c.id;
  this.editName = c.categoryName ?? '';
  this.errorMsg = '';
}

cancelEdit(): void {
  this.editingId = null;
  this.editName = '';
}

saveEdit(c: AdminCategory): void {
  const name = (this.editName ?? '').trim();

  if (!name) {
    this.errorMsg = 'Category name cannot be empty.';
    return;
  }

  this.saving = true;
  this.errorMsg = '';

  this.categoryService.update(c.id, { categoryName: name }).subscribe({
    next: () => {
      this.saving = false;
      this.cancelEdit();
      this.loadCategories(); // simplest + reliable
    },
    error: (err) => {
      this.saving = false;
      this.errorMsg = err?.error?.message ?? 'Failed to update category.';
      console.error('PUT category failed:', err);
    },
  });
}


}
