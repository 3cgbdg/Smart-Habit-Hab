import { createZodDto } from 'nestjs-zod';
import { AuthFormSchema } from '@smart-habit/shared';

export class GeneralAuthDto extends createZodDto(AuthFormSchema) { }
