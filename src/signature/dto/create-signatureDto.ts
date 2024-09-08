import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSignatureDto {
  @IsString({ message: 'Agreement Id must be a string' })
  @IsNotEmpty({ message: 'Agreement Id cannot be empty' })
  agreementId: string;


  @IsString({ message: 'Agreement Id must be a string' })
  @IsNotEmpty({ message: 'Agreement Id cannot be empty' })
  userId: string;


  @IsString({ message: 'Signature must be a string' })
  @IsNotEmpty({ message: 'Signature cannot be empty' })
  signature: string;

}
     