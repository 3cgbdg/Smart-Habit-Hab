import { createZodDto } from 'nestjs-zod';
import { GetProfileSchema } from '@smart-habit/shared';

export class GetProfileResponseDto extends createZodDto(GetProfileSchema) {}
