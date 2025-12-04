export interface Product {
    id: number;
    title: string;
    content: string;
    image: string | null;
    pris: number | string;
    farg?: string | null;
    material?: string | null;
    kladestyp: string[];
    storlek: string[];
}