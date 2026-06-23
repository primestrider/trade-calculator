export interface StockSearchParams {
  keywords?: string;
  pageBegin?: number;
  pageLength?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface Stock {
  Id: number;

  Name: string;
  Code: string;

  StockSubSectorId: number;
  SubSectorName: string;

  StockSectorId: number;
  SectorName: string;

  NewSubIndustryId: number;
  NewSubIndustryName: string;

  NewIndustryId: number;
  NewIndustryName: string;

  NewSubSectorId: number;
  NewSubSectorName: string;

  NewSectorId: number;
  NewSectorName: string;

  Last: number;
  PrevClosingPrice: number;

  AdjustedClosingPrice: number;
  AdjustedOpenPrice: number;
  AdjustedHighPrice: number;
  AdjustedLowPrice: number;

  Volume: number;
  Frequency: number;
  Value: number;

  OneDay: number;
  OneWeek: number;
  OneMonth: number;
  ThreeMonth: number;
  SixMonth: number;
  OneYear: number;
  ThreeYear: number;
  FiveYear: number;
  TenYear: number | null;

  Mtd: number;
  Ytd: number;

  Per: number | null;
  Pbr: number | null;
  Capitalization: number | null;

  BetaOneYear: number | null;
  StdevOneYear: number | null;

  PerAnnualized: number | null;
  PsrAnnualized: number | null;
  PcfrAnnualized: number | null;

  AdjustedAnnualHighPrice: number;
  AdjustedAnnualLowPrice: number;

  LastDate: string;
  LastUpdate: string;

  Roe: number | null;

  FreeFloatPct: number | null;
}

export type Sector = {
  Name: string;
  NameEn: string;
  Code: string;
  IndexName: string | null;
  Description: string;
  Id: number;
  DateCreated: string;
  DateModified: string;
  IsUpdateDate: boolean;
};
