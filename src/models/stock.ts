export interface StockSearchParams {
  keywords?: string;
  pageBegin?: number;
  pageLength?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Stock {
  id: number;
  name: string;
  code: string;

  stockSubSectorId: number;
  subSectorName: string;

  stockSectorId: number;
  sectorName: string;

  newSubIndustryId: number;
  newSubIndustryName: string;

  newIndustryId: number;
  newIndustryName: string;

  newSubSectorId: number;
  newSubSectorName: string;

  newSectorId: number;
  newSectorName: string;

  last: number;
  prevClosingPrice: number;

  adjustedClosingPrice: number;
  adjustedOpenPrice: number;
  adjustedHighPrice: number;
  adjustedLowPrice: number;

  volume: number;
  frequency: number;
  value: number;

  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  tenYear: number;

  mtd: number;
  ytd: number;

  per: number;
  pbr: number;
  capitalization: number;

  betaOneYear: number;
  stdevOneYear: number;

  perAnnualized: number;
  psrAnnualized: number;
  pcfrAnnualized: number;

  adjustedAnnualHighPrice: number;
  adjustedAnnualLowPrice: number;

  lastDate: string;
  lastUpdate: string;

  roe: number;
}