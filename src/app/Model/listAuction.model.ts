export interface ItemData {
    id: number;
}

export interface Auction {
    itemData: ItemData;
    startingBid: number;
    duration: number;
    buyNowPrice: number;
}

export interface DynamicObjectivesUpdates {
    needsGroupsRefresh: boolean;
    needsAutoClaim: boolean;
}

export interface AuctionResponse {
    id: number;
    idStr: string;
    dynamicObjectivesUpdates: DynamicObjectivesUpdates;
}

export interface ListSearchData {
    sId: string;
    start: number;
    num: number;
    type: string;
    nat: number;
    cat: string;
    maskedDefId: number;
    lev: string;
    leag: number;
    pos: string;
    micr: number;
    macr: number;
    minb: number;
    maxb: number;
}

export interface BuyNowPlayerPrices {
    valor: number;
    qtd: number;
}

