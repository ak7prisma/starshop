import { Product } from "@/datatypes/productsType";

export const getCategories = (products: Product[]): string[] => {
    return ["All", ...new Set(products.map(p => p.category))];
};