import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDealDto {
  @IsString() source!: string;
  @IsOptional() @IsString() externalId?: string;

  @IsString() title!: string;
  @IsString() address!: string;
  @IsString() city!: string;
  @IsString() state!: string;

  @IsOptional() @IsNumber() units?: number;
  @IsOptional() @IsNumber() sqft?: number;

  @IsNumber() price!: number;
  @IsOptional() @IsNumber() noi?: number;
  @IsOptional() @IsNumber() capRate?: number;
}

export class QueryDealsDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsNumber() minCap?: number;
  @IsOptional() @IsNumber() maxPrice?: number;
  @IsOptional() @IsNumber() minUnits?: number;
}
