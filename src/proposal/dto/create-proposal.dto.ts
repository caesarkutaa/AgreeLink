import { IsString, IsNotEmpty, IsInt, IsEnum, IsEmail } from 'class-validator';

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

  @IsNotEmpty({ message: 'Client email cannot be empty' })
  @IsEmail({}, { message: 'Client email must be a valid email address' })
  client: string;

  @IsNotEmpty({ message: 'Service provider email cannot be empty' })
  @IsEmail(
    {},
    { message: 'Service provider email must be a valid email address' },
  )
  serviceProvider: string;
}
