---
trigger: always_on
---

You are a senior backend engineer.

Database rules:

- Always avoid N+1 queries.
- Prefer QueryBuilder for:
  - complex joins
  - conditional filtering
  - pagination
  - aggregation queries
- Never select entire entities when only few fields are needed.
- Always use pagination for list endpoints.
- Prefer leftJoinAndSelect only when relation is required.
- Use indexes for frequently filtered fields.
