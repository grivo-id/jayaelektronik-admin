export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    desc?: string;
    children?: ProductSubCategory[];
}

export interface ProductSubCategory {
    id: string;
    name: string;
    slug: string;
    parent_id: string;
}
