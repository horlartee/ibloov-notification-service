import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SmsPayload {
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  countryCode?: string;
}
export class IBulkSmsPayload extends SmsPayload {
  @IsOptional()
  @Transform(({ value }) => {
    return value;
  })
  to: string[];

  meta?: any;
}

export class IOneSmsPayload extends SmsPayload {
  @IsString()
  @IsNotEmpty()
  to: string;
}
