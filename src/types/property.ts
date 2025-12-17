// src/types/property.ts
export interface ArecaInfo {
    ageYears: number | null;
    yielding: boolean;
}

export interface CoconutInfo {
    ageYears: number | null;
    yielding: boolean;
}

export interface BuildingInfo {
    areaSqft: number | null;
    yearOfConstruction: number | null;
}

export type ConversionType = 'none' | 'residential' | 'commercial';

export interface Property {
    id?: string;
    villageName: string;
    surveyNo: string;
    areaAcres: number | null;
    areaCents: number | null;

    rtcAvailable: boolean;           // Y/N
    fmbSketchDetails: string;        // description / reference text
    conversionType: ConversionType;  // none / residential / commercial
    conversionOrderDetails: string;  // order + sketch notes

    khathaAvailable: boolean;
    khathaDetails: string;

    ownerName: string;
    ownerAddress: string;
    ownerMobile: string;
    brokerName: string;
    brokerMobile: string;

    ownerLandCost: number | null;
    costNegotiable: boolean;

    borewells: number | null;
    openwellsLakesPonds: number | null;
    areca: ArecaInfo;
    coconut: CoconutInfo;
    otherCultivation: string;

    buildings: BuildingInfo[];

    createdAt?: Date;
    updatedAt?: Date;
}
