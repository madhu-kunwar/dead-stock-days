export interface Product {
  id: string;
  name: string;
  price: number;
  era: string;
  archiveType: string;
  productCategory?: string;
  shoppingCategory?: string;
  size?: string;
  color?: string;
  brand?: string;
  material?: string;
  style?: string;
  description: string;
  function: string;
  quantity: number;
  soldOut: boolean;
  image: string;
  dropDate: string;
  dropName: string;
}

export type ArchiveFilter = 'All' | 'T-Shirts' | 'Shirts' | 'Hoodies & Sweatshirts' | 'Jackets & Coats' | 'Jeans' | 'Pants / Trousers' | 'Shorts' | 'Activewear' | 'Underwear' | 'Suits / Formal Wear' | 'Accessories';
export type EraFilter = 'All' | '90s' | '2000s' | '80s';
