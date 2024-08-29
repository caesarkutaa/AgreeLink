import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { STATE } from '@prisma/client';

export class CreateAgreementDto {
  @IsNotEmpty()
  @IsString()
  proposalId: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  serviceProviderId: string;

  @IsOptional()
  @IsEnum(STATE)
  state?: STATE;
}

