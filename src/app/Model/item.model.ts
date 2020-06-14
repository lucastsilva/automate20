export interface ItemData {
    id: number;
    pile: string;
    success: boolean;
}

export interface Item {
    itemData: ItemData[];
}