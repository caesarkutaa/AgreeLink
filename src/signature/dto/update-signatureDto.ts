import { IsOptional, IsString } from 'class-validator';

export class UpdateSignatureDto {
  @IsOptional()
  @IsString({ message: 'Agreement Id must be a string' })
  agreementId?: string;

  @IsOptional()
  @IsString({ message: 'User Id must be a string' })
  userId?: string;

  @IsOptional()
  @IsString({ message: 'Signature must be a string' })
  signature?: string;
}
