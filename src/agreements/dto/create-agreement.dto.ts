import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum STATE {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export class CreateAgreementDto {
  @IsString({ message: 'Proposal Id must be a string' })
  @IsNotEmpty({ message: 'Proposal Id cannot be empty' })
  proposalId: string;

  @IsString({ message: 'Client Id must be a string' })
  @IsNotEmpty({ message: 'Client Id cannot be empty' })
  clientId: string;

  @IsString({ message: 'ServiceProvider Id must be a string' })
  @IsNotEmpty({ message: 'ServiceProvider Id cannot be empty' })
  serviceProviderId: string;

  @IsOptional()
  @IsEnum(STATE, { message: 'State must be PENDING, ACTIVE, or COMPLETED' })
  state: STATE;
}



