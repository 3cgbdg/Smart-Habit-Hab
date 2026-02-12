import { createZodDto } from 'nestjs-zod';
import { CreateHabitSchema } from '@smart-habit/shared';

export class CreateHabitDto extends createZodDto(CreateHabitSchema) {}
