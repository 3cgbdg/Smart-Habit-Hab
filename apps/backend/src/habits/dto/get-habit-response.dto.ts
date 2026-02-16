import { createZodDto } from 'nestjs-zod';
import { GetHabitSchema } from '@smart-habit/shared';

export class GetHabitResponseDto extends createZodDto(GetHabitSchema) {}
