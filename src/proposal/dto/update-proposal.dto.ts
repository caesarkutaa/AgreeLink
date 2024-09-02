import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

export enum STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateProposalDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsEnum(STATUS, { message: 'Status must be PENDING, ACCEPTED, or REJECTED' })
  @IsOptional()
  status?: STATUS;
}
