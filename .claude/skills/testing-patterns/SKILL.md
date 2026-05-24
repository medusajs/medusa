---
name: testing-patterns
description: Testing patterns and principles. Unit, integration, mocking strategies.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Testing Patterns

> Principles for reliable test suites.

---

## 1. Testing Pyramid

```
        /\          E2E (Few)
       /  \         Critical flows
      /----\
     /      \       Integration (Some)
    /--------\      API, DB queries
   /          \
  /------------\    Unit (Many)
                    Functions, classes
```

---

## 2. AAA Pattern

| Step | Purpose |
|------|---------|
| **Arrange** | Set up test data |
| **Act** | Execute code under test |
| **Assert** | Verify outcome |

---

## 3. Test Type Selection

### When to Use Each

| Type | Best For | Speed |
|------|----------|-------|
| **Unit** | Pure functions, logic | Fast (<50ms) |
| **Integration** | API, DB, services | Medium |
| **E2E** | Critical user flows | Slow |

---

## 4. Unit Test Principles

### Good Unit Tests

| Principle | Meaning |
|-----------|---------|
| Fast | < 100ms each |
| Isolated | No external deps |
| Repeatable | Same result always |
| Self-checking | No manual verification |
| Timely | Written with code |

### What to Unit Test

| Test | Don't Test |
|------|------------|
| Business logic | Framework code |
| Edge cases | Third-party libs |
| Error handling | Simple getters |

---

## 5. Integration Test Principles

### What to Test

| Area | Focus |
|------|-------|
| API endpoints | Request/response |
| Database | Queries, transactions |
| External services | Contracts |

### Setup/Teardown

| Phase | Action |
|-------|--------|
| Before All | Connect resources |
| Before Each | Reset state |
| After Each | Clean up |
| After All | Disconnect |

---

## 6. Mocking Principles

### When to Mock

| Mock | Don't Mock |
|------|------------|
| External APIs | The code under test |
| Database (unit) | Simple dependencies |
| Time/random | Pure functions |
| Network | In-memory stores |

### Mock Types

| Type | Use |
|------|-----|
| Stub | Return fixed values |
| Spy | Track calls |
| Mock | Set expectations |
| Fake | Simplified implementation |

---

## 7. Test Organization

### Naming

| Pattern | Example |
|---------|---------|
| Should behavior | "should return error when..." |
| When condition | "when user not found..." |
| Given-when-then | "given X, when Y, then Z" |

### Grouping

| Level | Use |
|-------|-----|
| describe | Group related tests |
| it/test | Individual case |
| beforeEach | Common setup |

---

## 8. Test Data

### Strategies

| Approach | Use |
|----------|-----|
| Factories | Generate test data |
| Fixtures | Predefined datasets |
| Builders | Fluent object creation |

### Principles

- Use realistic data
- Randomize non-essential values (faker)
- Share common fixtures
- Keep data minimal

---

## 9. Best Practices

| Practice | Why |
|----------|-----|
| One assert per test | Clear failure reason |
| Independent tests | No order dependency |
| Fast tests | Run frequently |
| Descriptive names | Self-documenting |
| Clean up | Avoid side effects |

---

## 10. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Test implementation | Test behavior |
| Duplicate test code | Use factories |
| Complex test setup | Simplify or split |
| Ignore flaky tests | Fix root cause |
| Skip cleanup | Reset state |

---

> **Remember:** Tests are documentation. If someone can't understand what the code does from the tests, rewrite them.
