import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProofOfDeliveryDto {
  @IsString()
  @IsOptional()
  signatureUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];
}