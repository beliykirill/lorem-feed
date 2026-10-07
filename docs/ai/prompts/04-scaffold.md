# Этап 04. Каркас

Сообщения пользователя из сессии [`docs/ai/sessions/04-scaffold.md`](../sessions/04-scaffold.md). Тексты приведены без изменений. Переносы строк — как в экспорте сессии. Служебные команды (`/export`) не включены. Ответы на вопросы агента в режиме планирования даны текстом в поле «Other» и приведены так, как они записаны в экспорте; план утверждён кнопкой, без текста. Запрос на извлечение промптов, отправленный после `/export`, в экспорт не попал.

## Промпт 1

_Поставить задачу этапа 4: инициализировать RN-проект, тулчейн, lint, FSD-структуру, навигацию, Jest, CI; проверить правила lint на примерах и чистый клон; сначала показать план._

```text
Работаем по скиллу take-home, этап 4: каркас проекта. Бизнес-логику, сторы и
запросы не пишем — только инфраструктура по docs/architecture.md.

1. Инициализация: последняя стабильная версия RN через
@react-native-community/cli во временную папку, перенос в корень без потери
существующих файлов (docs/, .claude/, CLAUDE.md).
2. yarn Berry по R-12: packageManager, nodeLinker: node-modules, .nvmrc,
engines, postinstall с pod install только на macOS.
3. TypeScript strict, алиасы путей по FSD-слоям (tsconfig + babel).
4. ESLint + Prettier: eslint-plugin-boundaries для FSD, запрет faker и
onRefresh/refreshControl, исключение для тестов. Проверь на примерах, что
правила срабатывают (импорт вверх, глубокий импорт по алиасу, относительный
путь из соседнего слайса, faker вне модуля обогащения), и опиши результат.
5. FSD-структура папок с index.ts в слайсах.
6. Навигация: native-stack, два экрана-заглушки, типы маршрутов в
shared/config/navigation.
7. Jest: transformIgnorePatterns для @faker-js, один тест-заглушка проходит.
Проверь, что faker собирается и в Metro.
8. CI на GitHub Actions: lint, typecheck, test.

Зависимости — только перечисленные в architecture.md. Проверка в конце:
чистый клон во временную папку → yarn install → yarn typecheck / lint / test
зелёные. Сначала покажи план.
```

## Ответы на вопросы агента

_Алиасы по слоям противоречили architecture 6.2 (алиасов нет, нужных зависимостей нет в стеке); чистый клон требует коммита, а коммиты — только по запросу. После этого план утверждён._

```text
· Point 3 asks for path aliases, but architecture.md (6.2, "Решено
агентом") says there are none: they need babel-plugin-module-resolver (for
Metro/Jest), and eslint-plugin-boundaries needs an import resolver to
follow them. None of these are in the stack. How should I handle aliases? →
Алиасы делаем, но один общий: @/ → src/ (импорты вида @/entities/post),
без отдельных алиасов по слоям — пункт 3 моего промпта в этой части
отменяется.
Разрешаю dev-зависимости: babel-plugin-module-resolver (Metro и Jest) и
eslint-import-resolver-typescript (резолвер для eslint-plugin-boundaries).
Настрой tsconfig paths, babel и резолвер ESLint согласованно.
Обнови 6.2 в architecture.md: решение принято мной, с причиной — читаемость
импортов между слоями. В проверке правил boundaries из пункта 4 проверь
оба варианта: и алиас, и относительный путь.
· The final clean-clone check needs the scaffold in git, but you commit
only on request, and stage-3 docs are still uncommitted. How should I run
it? → Документы этапа 3 я закоммичу сам сейчас, отдельным коммитом. Для
каркаса разрешаю тебе один коммит: после того как yarn typecheck / lint /
test зелёные локально, закоммить каркас (сообщение в стиле conventional
commits, например chore: scaffold React Native project), затем сделай
чистый клон из локального репозитория во временную папку и прогони там yarn
install / typecheck / lint / test. Если в клоне что-то падает —
исправление отдельным коммитом. Не пушь.
```

## Промпт 2

_Проверить запись этапа 4 в журнале по списку пунктов и дописать недостающее без выдумок._

```text
Покажи запись этапа 4 в docs/ai/JOURNAL.md и проверь, что в ней есть:
- что сделано: версия RN, структура, навигация, линтеры, тесты, CI;
- отклонения от моего промпта и почему: один алиас @/ вместо алиасов по
слоям, eslint-plugin-boundaries, все добавленные зависимости с причиной;
- результат проверки lint-правил на примерах: какие случаи проверены и что
сработало;
- результат чистого клона: что упало (если падало) и чем исправлено;
- проблемы при запуске на iOS и Android и их решения;
- где ты ошибся и что я поправил.
  Если чего-то не хватает — допиши. Ничего не выдумывай: если пункт не
происходил, так и напиши.
```

## Промпт 3

_Прогон ревьюера на текущем состоянии проекта._

```text
Запусти ревьюера на текущем состоянии проекта
```

## Промпт 4

_Решения по 4 замечаниям второго прогона ревьюера: `.idea/` из git, public API `app`, одобрение пакетов шаблона, экспорт сессии; повторный прогон и обновление журнала._

```text
1. Да, убери .idea/ из git (git rm --cached -r .idea), отдельным коммитом:
chore: remove IDE files from git. Проверь, что .gitignore их действительно
покрывает.
2. Да, поправь architecture.md: app отдаёт App через index.ts, его
импортирует корневой index.js.
3. Пакеты шаблона RN CLI одобрены целиком. Добавь в Stack в CLAUDE.md
правило: «Everything installed by the RN CLI template is approved; the
approval rule applies to packages added on top of it». Тогда фраза в журнале
верна.
4. Да, экспорт делаю я. Отметь это в журнале.

После правок — повторный прогон ревьюера, затем обнови запись этапа 4.
```
