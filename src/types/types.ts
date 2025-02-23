export interface ItemProp {
    id?: number;
    name: string;
    description: string;
    price: number;
    group_id?: number | null;
}

export interface InvoiceProp {
    id: number;
    patient_name: string;
    patient_age: number;
    patient_address: string;
    patient_phone: string;
    items: ItemProp[];
    discount: number;
    amount_paid: number;
    remarks?: string;
    created_at?: string;
}

export interface EditProp {
    id: number;
    created_at: string;
    after: string;
}

export interface PrintingInvoiceProp {
    id: number;
    patient_name: string;
    patient_age: number;
    patient_address: string;
    patient_phone: string;
    items: ItemProp[];
    discount: number;
    amount_paid: number;
    remarks?: string;
    created_at: string;
}

export interface ItemGroupProp {
    id: number;
    name: string;
}

export interface PatientProp {
    id: number;
    name: string;
    age: number;
    address: string;
    phone: string;
    created_at: string;
}