import { IsOptional, IsString, IsEnum } from 'class-validator';
import { STATE } from '@prisma/client';

export class UpdateAgreementDto {
  @IsOptional()
  @IsString()
  proposalId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  serviceProviderId?: string;

  @IsOptional()
  @IsEnum(STATE)
  state?: STATE;
}

