export type AlertProps = {
    icon: string;
    title:string;
    text: string;
}

export type Empresa = {
    id?: number;
    name: string;
    created_by: string;
    category: number;
    description: string;
    status: number;
    creation_date: string;
    rate: number;
    location: number;
    direction: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    telefono?: string;
    productos: string;
}

export type Rating ={
    id?: number;
    empresa: number;
    name: string;
    rate: number;
    comment: string;
}