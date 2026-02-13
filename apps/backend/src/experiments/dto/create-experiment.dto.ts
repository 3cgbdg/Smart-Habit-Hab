import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExperimentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  habitId: string;

  @IsNotEmpty()
  @IsString()
  variable: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }: { value: string | null | undefined }) => {
    return value === '' ? null : value;
  })
  endDate?: string;
}
