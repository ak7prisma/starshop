export interface Product {
    idProduct: number;
    nameProduct: string;
    developer: string;
    imgUrl: string;
    imgAlt: string;
    href: string;
    category: 'Games' | 'Voucher' | 'E-Money' | 'Lainnya';
    amount: string[];
    price:  number[];
}