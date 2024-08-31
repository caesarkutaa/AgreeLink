import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';

export enum STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CreateProposalDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsInt({ message: 'Duration must be an integer' })
  @IsNotEmpty({ message: 'Duration cannot be empty' })
  duration: number; // Duration in days, weeks, etc., based on your requirement

  @IsString({ message: 'Payment terms must be a string' })
  @IsNotEmpty({ message: 'Payment terms cannot be empty' })
  paymentTerms: string;

  @IsEnum(STATUS, { message: 'Status must be PENDING, ACCEPTED, or REJECTED' })
  status: STATUS;

  @IsString({ message: 'Client ID must be a string' })
  @IsNotEmpty({ message: 'Client ID cannot be empty' })
  client: string;

  @IsString({ message: 'Service provider ID must be a string' })
  @IsNotEmpty({ message: 'Service provider ID cannot be empty' })
  serviceProvider: string;
}
