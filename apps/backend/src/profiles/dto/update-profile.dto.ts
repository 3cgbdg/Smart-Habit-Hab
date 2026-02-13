import { createZodDto } from 'nestjs-zod';
import { UpdateProfileSchema } from '@smart-habit/shared';

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) { }
