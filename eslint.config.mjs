// @ts-check
import backendConfig from './apps/backend/eslint.config.mjs';
import frontendConfig from './apps/frontend/eslint.config.mjs';
import sharedConfig from './packages/shared/eslint.config.mjs';

export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.next/**',
            '**/out/**',
        ],
    },
    ...backendConfig.map((config) => {
        if (config.ignores) return config;
        return {
            ...config,
            files: ['apps/backend/**/*.ts'],
        };
    }),
    ...frontendConfig.map((config) => {
        if (config.ignores) return config;
        return {
            ...config,
            files: ['apps/frontend/**/*.{ts,tsx}'],
        };
    }),
    ...sharedConfig.map((config) => {
        if (config.ignores) return config;
        return {
            ...config,
            files: ['packages/shared/**/*.ts'],
        };
    }),
];
