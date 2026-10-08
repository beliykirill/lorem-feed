# Артефакты AI-подхода

- [`AI_WORKFLOW.md`](AI_WORKFLOW.md) — процесс, роли, инструменты, ошибки агента и как они пойманы.
- [`JOURNAL.md`](JOURNAL.md) — журнал этапов: что сделано, что отклонено, правки автора.
- Правила агента: [`CLAUDE.md`](../../CLAUDE.md), скилл [`take-home`](../../.claude/skills/take-home/SKILL.md), сабагент [`reviewer`](../../.claude/agents/reviewer.md), хук [`post-edit-check.sh`](../../.claude/hooks/post-edit-check.sh).
- Спецификация: [`requirements.md`](../requirements.md), [`architecture.md`](../architecture.md).

## Этапы

`sessions/` — экспорт сессии Claude Code. `prompts/` — сообщения автора из этой сессии без изменений.

| Этап | Сессия | Промпты | Прочее |
|------|--------|---------|--------|
| 0. Подготовка | — (отдельный чат в claude.ai, не прикладывается, см. [`AI_WORKFLOW.md`](AI_WORKFLOW.md#этап-0-подготовка)) | — | — |
| 1. Требования | [`sessions/01-requirements.md`](sessions/01-requirements.md) | [`prompts/01-requirements.md`](prompts/01-requirements.md) | [`requirements.md`](../requirements.md) |
| 2. AI-окружение | [`sessions/02-setup.md`](sessions/02-setup.md) | [`prompts/02-setup.md`](prompts/02-setup.md) | `CLAUDE.md`, `.claude/` |
| 3. Архитектура | [`sessions/03-architecture.md`](sessions/03-architecture.md) | [`prompts/03-architecture.md`](prompts/03-architecture.md) | [`architecture.md`](../architecture.md) |
| 4. Каркас | [`sessions/04-scaffold.md`](sessions/04-scaffold.md) | [`prompts/04-scaffold.md`](prompts/04-scaffold.md) | скриншоты запуска каркаса: [iOS](screenshots/04-scaffold-ios-posts.png), [Android, список](screenshots/04-scaffold-android-posts.png), [Android, детали](screenshots/04-scaffold-android-details.png) |
| 5. Данные и состояние | [`sessions/05-data.md`](sessions/05-data.md) | [`prompts/05-data.md`](prompts/05-data.md) | — |
| 6. UI | [`sessions/06-ui.md`](sessions/06-ui.md) | [`prompts/06-ui.md`](prompts/06-ui.md) | скриншоты приложения: [`docs/screenshots/`](../screenshots/) |
| 7. Финал | [`sessions/07-final.md`](sessions/07-final.md) | [`prompts/07-final.md`](prompts/07-final.md) | [`README.md`](../../README.md), [релиз v1.0.0 с APK](https://github.com/beliykirill/lorem-feed/releases/tag/v1.0.0) |
| 8. Финальный аудит и доводка | [`sessions/08-audit-fixes.md`](sessions/08-audit-fixes.md) | [`prompts/08-audit-fixes.md`](prompts/08-audit-fixes.md) | запись этапа 8 в [`JOURNAL.md`](JOURNAL.md) |
