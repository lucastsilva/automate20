export interface ItemData {
  id: any;
  timestamp: number;
  formation: string;
  untradeable: boolean;
  assetId: number;
  rating: number;
  itemType: string;
  resourceId: number;
  owners: number;
  discardValue: number;
  itemState: string;
  cardsubtypeid: number;
  lastSalePrice: number;
  fitness: number;
  injuryType: string;
  injuryGames: number;
  preferredPosition: string;
  training: number;
  contract: number;
  teamid: number;
  rareflag: number;
  playStyle: number;
  leagueId: number;
  assists: number;
  lifetimeAssists: number;
  loyaltyBonus: number;
  pile: number;
  nation: number;
  resourceGameYear: number;
  groups: number[];
  attributeArray: number[];
  statsArray: number[];
  lifetimeStatsArray: number[];
  skillmoves: number;
  weakfootabilitytypecode: number;
  attackingworkrate: number;
  defensiveworkrate: number;
  trait1: number;
  trait2: number;
  preferredfoot: number;
}

export interface AuctionInfo {
  tradeId: any;
  itemData: ItemData;
  tradeState: string;
  buyNowPrice: number;
  currentBid: number;
  offers: number;
  watched: boolean;
  bidState: string;
  startingBid: number;
  confidenceValue: number;
  expires: number;
  sellerName: string;
  sellerEstablished: number;
  sellerId: number;
  tradeOwner: boolean;
  tradeIdStr: string;
}

export interface BidTokens {}

export interface TransferList {
  auctionInfo: AuctionInfo[];
  bidTokens: BidTokens;
}

export interface RequestError {
  reason: string;
  message?: any;
  code: number;
}

export interface ItemData {
  id: any;
  timestamp: number;
  formation: string;
  untradeable: boolean;
  assetId: number;
  rating: number;
  itemType: string;
  resourceId: number;
  owners: number;
  discardValue: number;
  itemState: string;
  cardsubtypeid: number;
  lastSalePrice: number;
  fitness: number;
  injuryType: string;
  injuryGames: number;
  preferredPosition: string;
  training: number;
  contract: number;
  teamid: number;
  rareflag: number;
  playStyle: number;
  leagueId: number;
  assists: number;
  lifetimeAssists: number;
  loyaltyBonus: number;
  pile: number;
  nation: number;
  resourceGameYear: number;
  groups: number[];
  attributeArray: number[];
  statsArray: number[];
  lifetimeStatsArray: number[];
  skillmoves: number;
  weakfootabilitytypecode: number;
  attackingworkrate: number;
  defensiveworkrate: number;
  trait1: number;
  trait2: number;
  preferredfoot: number;
}

export interface AuctionInfo {
  tradeId: any;
  itemData: ItemData;
  tradeState: string;
  buyNowPrice: number;
  currentBid: number;
  offers: number;
  watched: boolean;
  bidState: string;
  startingBid: number;
  confidenceValue: number;
  expires: number;
  sellerName: string;
  sellerEstablished: number;
  sellerId: number;
  tradeOwner: boolean;
  tradeIdStr: string;
}

export interface BidTokens {
}

export interface Currency {
  name: string;
  funds: number;
  finalFunds: number;
}

export interface Bid {
  credits: number;
  auctionInfo: AuctionInfo[];
  bidTokens: BidTokens;
  currencies: Currency[];
}
