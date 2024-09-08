import { IsString, IsOptional, IsInt, IsEnum, IsNotEmpty } from 'class-validator';

export enum STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateProposalDto {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsInt({ message: 'Duration must be an integer' })
  duration: number; // Duration in days, weeks, etc., based on your requirement

  @IsString({ message: 'Payment terms must be a string' })
  paymentTerms: string;

  @IsEnum(STATUS, { message: 'Status must be PENDING, ACCEPTED, or REJECTED' })
  status: STATUS;

}
