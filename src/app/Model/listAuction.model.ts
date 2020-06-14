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

