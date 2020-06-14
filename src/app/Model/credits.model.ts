export interface BidTokens {
}

export interface Currency {
    name: string;
    funds: number;
    finalFunds: number;
}

export interface UnopenedPacks {
    preOrderPacks: number;
    recoveredPacks: number;
}

export interface Credits {
    credits: number;
    bidTokens: BidTokens;
    currencies: Currency[];
    unopenedPacks: UnopenedPacks;
}