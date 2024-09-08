import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum STATE {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export class UpdateAgreementDto {
  @IsString({ message: ' Proposal Id must be a string' })
  proposalId: string;

  @IsString({ message: ' Client  Id must be a string' })
  clientId: string;

  @IsString({ message: 'ServiceProvider  Id must be a string' })
  serviceProviderId: string;

  
  @IsEnum(STATE, { message: 'State must be PENDING, ACTIVE, or COMPLETED' })
  state: STATE;
}
