import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WhatsappPayload {
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  contentVariables?: any;

  @IsString()
  @IsOptional()
  contentSid?: string;
}
