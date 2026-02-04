export interface TopupData {
    uid: string;
    idTopup: number;
    idGame: string;
    idProduct: number;
    amount: number;
    price: number;
    status: string;
    paymentMethod: string | null;
    paymentProofUrl: string | null;
    created_at: string;
    Products?: {
        nameProduct: string;
        itemName?: string;
    };
}