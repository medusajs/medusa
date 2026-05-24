---
name: systems-programming
description: Systems programming and hardware sympathy guidelines based on CS:APP standards. Use when working on memory-intensive, performance-critical, or low-level concurrent code.
allowed-tools: Read, Write, Edit
---

# Systems Programming & Hardware Sympathy (CS:APP Standards)

> "To understand the program, one must understand the machine."

## 1. Data Representation
- **Floating Point Imprecision**: `0.1 + 0.2 != 0.3`. Не используй float/double для денег.
- **Integer Overflow**: Помни про границы типов. Всегда проверяй переполнение при арифметике с пользовательским вводом.

## 2. Cache Locality
- **Data Locality**: Доступ к RAM медленный. Данные в памяти должны лежать плотно (массивы лучше связных списков) для Cache Hit.
- **Sequential Access**: Чтение памяти последовательно в 100 раз быстрее, чем случайный доступ.

## 3. Concurrency
- **Race Conditions**: `i++` не атомарна. Используй блокировки (mutex/semaphores) или атомарные операции (`atomic`).
- **Deadlocks**: Всегда захватывай блокировки в одинаковом порядке во всех потоках.
- **Thread Safety**: Избегай разделяемого изменяемого состояния (shared mutable state) там, где это возможно.

## 4. Resource Management
- **File Descriptors**: Закрывай соединения и файлы в `finally` или через контекстные менеджеры. Иначе исчерпаешь лимиты ОС.
- **Memory Leaks**: В языках без GC (C/C++, Rust) каждый `alloc` должен иметь свой `free`. В языках с GC следи за ссылками в глобальных объектах.

---

## Performance Checklist

- [ ] Data structures chosen for cache locality
- [ ] Concurrency issues (races, deadlocks) analyzed
- [ ] Resource cleanup guaranteed
- [ ] Integer/Float precision handled correctly
