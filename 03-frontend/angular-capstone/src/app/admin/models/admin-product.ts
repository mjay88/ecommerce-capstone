import { AdminCategory } from './admin-category';

export interface AdminProduct {
  id: number;

  name: string;
  description: string;
  unitPrice: number;
  unitsInStock: number;
  active: boolean;

  sku: string | null;
  imageUrl: string | null;

  dateCreated: string;   
  lastUpdated: string;   

  category: AdminCategory;
}
