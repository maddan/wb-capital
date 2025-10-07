export declare class CreateDealDto {
    source: string;
    externalId?: string;
    title: string;
    address: string;
    city: string;
    state: string;
    units?: number;
    sqft?: number;
    price: number;
    noi?: number;
    capRate?: number;
}
export declare class QueryDealsDto {
    city?: string;
    state?: string;
    minCap?: number;
    maxPrice?: number;
    minUnits?: number;
}
