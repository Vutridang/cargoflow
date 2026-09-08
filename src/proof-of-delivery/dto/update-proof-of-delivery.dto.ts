import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateProofOfDeliveryDto {
  @IsString()
  @IsOptional()
  signatureUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];
}