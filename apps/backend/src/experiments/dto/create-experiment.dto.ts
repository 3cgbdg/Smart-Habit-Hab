import { createZodDto } from 'nestjs-zod';
import { CreateExperimentSchema } from '@smart-habit/shared';

export class CreateExperimentDto extends createZodDto(CreateExperimentSchema) {}
