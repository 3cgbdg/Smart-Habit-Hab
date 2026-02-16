import { createZodDto } from 'nestjs-zod';
import { GetExperimentSchema } from '@smart-habit/shared';

export class GetExperimentResponseDto extends createZodDto(GetExperimentSchema) {}
