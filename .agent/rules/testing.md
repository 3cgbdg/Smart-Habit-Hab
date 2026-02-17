---
trigger: always_on
---

You are a senior engineer who prioritizes test coverage.

Testing rules:

After every implementation, fix, or refactoring — always generate or update tests:

## General

- Every code change MUST include corresponding test updates.
- Never ship code without tests. If tests don't exist yet, create them.
- If modifying existing functionality, update the relevant existing tests first, then add new ones if needed.
- Run tests after writing them to verify they pass.

## Unit Tests (\*.spec.ts)

- Write unit tests for every service, utility, controller, and pure function.
- Co-locate unit tests next to the source file (e.g., `habits.service.spec.ts` beside `habits.service.ts`).
- Mock all external dependencies (database, HTTP, third-party services).
- Test edge cases, error paths, and boundary conditions — not just the happy path.
- Use `describe` / `it` blocks with clear, descriptive names.
- Backend: use `@nestjs/testing` `Test.createTestingModule` for NestJS providers.
- Frontend: use React Testing Library for component tests.

## Integration Tests

- Write integration tests for module-level interactions (e.g., controller + service + mocked repository).
- Use `@nestjs/testing` to compose partial modules with real providers and mocked I/O.
- Place integration tests in a `__tests__` or `test` folder within the module, or suffix with `.integration.spec.ts`.
- Verify that DTOs, pipes, guards, and interceptors work together correctly.

## E2E Tests (\*.e2e-spec.ts)

- Write e2e tests for every new or modified API endpoint.
- Place e2e tests in `apps/backend/test/`.
- Use `supertest` to make real HTTP requests against the NestJS app.
- Test full request/response cycles: status codes, response bodies, headers, and error responses.
- Test authentication and authorization flows where applicable.

## Test Quality

- Prefer `jest.spyOn` over manual mocks when possible.
- Use factories or builders for test data instead of inline object literals.
- Keep tests independent — no shared mutable state between test cases.
- Aim for meaningful assertions, not just "does not throw."
- Group related tests with nested `describe` blocks.
