# Журнал этапов

Процесс описан в skill [`take-home`](../../.claude/skills/take-home/SKILL.md). Каждый этап заканчивается остановкой, следующий начинается только после подтверждения автора.

Формат записи: что сделано, что отклонено и почему, где агент ошибся и что поправил автор, артефакты.

---

## Этап 1. Требования — 2026-10-07

### Сделано
- Составлен [`docs/requirements.md`](../requirements.md):
  - явные требования T, F, D, S и неявные I;
  - неоднозначности A1–A15;
  - решения R-1…R-14;
  - допущения для README.
- Проверена совместимость `react-native-mmkv` 4.3.2, `react-native-nitro-modules` 0.37.1 и RN 0.87.1 с New Architecture (R-9). Нюанс: MMKV протестирован на RN 0.85.3, окончательная проверка — сборка на этапе каркаса.
- Проверен вывод `faker.image.urlPicsumPhotos` в `@faker-js/faker` 10.6.0: из 10 000 URL все содержат `/seed/`.
- Проверено, что picsum по одному seed отдаёт одно и то же изображение в разных размерах: `seed/jOx8D/32/32` и `seed/jOx8D/300/300` → `id/1010`.

### Отклонено
| Что | Почему |
|-----|--------|
| RTK Query, TanStack Query | Запросы идут через api-слой сущности, состояние в Zustand. Кэш-слой запросов здесь лишний (R-9) |
| Pull-to-refresh | Противоречит D-1: список запрашивается только один раз (R-4) |
| Кнопка сброса данных в UI | Не требуется. Сброс описан в README: переустановка или очистка данных (R-4) |
| `faker.seed(id)` | Картинки случайные на каждую установку, генерируются один раз и сохраняются (R-4) |
| Предзагрузка деталей всех постов | Лишний трафик. Детали грузятся по факту открытия (R-3) |
| Дисковый кэш картинок | Хватает системного кэша `Image`, без новых зависимостей (R-14) |
| Отдельный seed для 300×300 и запасной вариант с `urlPicsumPhotos` | Заменены одним seed на пост (R-2), см. ниже |

### Ошибки агента и правки автора

**Картинка 300×300 (Q16).**
- **Было.** Агент вывел из формулировки задания («обогатить ответ изображением 300×300»), что у картинки в деталях свой seed, независимый от картинки 32×32. Вывод был помечен как неподтверждённый и вынесен в вопрос Q16.
- **Стало.** У поста одна картинка. Seed генерируется через `faker.string.alphanumeric` один раз при обогащении списка и хранится с постом, оба URL picsum строятся из него.
- **Почему.** UX важнее буквального прочтения задания. Если у одного поста разные картинки в списке и в деталях, пользователь воспримет это как баг: «открыл не тот пост». Задание не требует, чтобы картинки были разными.
- **Урок.** Помеченное неподтверждённое допущение позволило поймать решение до написания кода.

**Состояния загрузки и ошибки (I-1).** Агент записал «загрузка и ошибки на обоих экранах». После ответов автора по R-3/R-4 требование уточнено:
- экран ошибки с кнопкой Retry — только на PostsScreen;
- на DetailsScreen ошибка фонового запроса экран не блокирует.

**Язык UI (Q17, Q18).** Автор давал подписи по-русски («Повторить», «В избранное»), а UI по требованиям на английском. Агент не стал переводить сам и спросил. Итоговое правило: весь UI на английском, русские формулировки автора передают смысл, а не готовые строки («Retry», «Add to favorites» / «In favorites»).

**Слой запросов.** В первом ответе автора было «репозиторий и use-cases». Во втором ответе автор уточнил: api-слой сущности в терминах FSD (R-10).

### Артефакты
- [`docs/requirements.md`](../requirements.md)
- [`docs/ai/prompts/01-requirements.md`](prompts/01-requirements.md)
- [`docs/ai/sessions/01-requirements.md`](sessions/01-requirements.md)

---

## Этап 2. AI-окружение — 2026-10-07

### Сделано
| Файл | Что внутри |
|------|-----------|
| [`CLAUDE.md`](../../CLAUDE.md) | Правила для агента на английском: контекст и импорт `@docs/requirements.md`, стек с версиями, запреты (Expo, зависимости без согласования, RTK/TanStack Query, pull-to-refresh, кнопка сброса), правило импортов FSD, 5 инвариантов со ссылками на R-*, команды, definition of done, языки, процесс |
| [`.claude/skills/take-home/SKILL.md`](../../.claude/skills/take-home/SKILL.md) | Универсальный процесс из 7 этапов: требования → AI-окружение → архитектура → каркас → данные и состояние → UI → финал. Для каждого этапа: вход, артефакт, проверка, запись в журнал. После этапа обязательная остановка до подтверждения |
| [`.claude/agents/reviewer.md`](../../.claude/agents/reviewer.md) | Сабагент-ревьюер только на чтение: импорты FSD, инварианты и запреты, `requirements.md` по пунктам T/F/D/S/I/R. Отчёт — таблица нарушений с `file:line`, без исправлений |
| [`.claude/settings.json`](../../.claude/settings.json) + [`.claude/hooks/post-edit-check.sh`](../../.claude/hooks/post-edit-check.sh) | Хук `PostToolUse` на `Edit\|Write\|MultiEdit`: `yarn typecheck` и `yarn eslint <file>`. Пока проекта нет, выходит с кодом 0. При ошибке — код 2, вывод уходит Claude |
| `docs/ai/JOURNAL.md` | Этот журнал. Заметки из `AI_WORKFLOW.md` перенесены сюда, в `AI_WORKFLOW.md` остался черновик со ссылкой |

Форматы skills, agents и hooks сверены с документацией Claude Code (code.claude.com/docs: skills, sub-agents, hooks).

### Решения автора по вопросам агента
- «AI-окружение» добавлено в skill отдельным этапом: в исходном списке этапов его не было.
- `CLAUDE.md` пишется на английском, как и `.claude/`.
- `react-native-screens` и `react-native-safe-area-context` согласованы как peer-зависимости React Navigation.
- Заметки о смене решений переносятся из `AI_WORKFLOW.md` в журнал.

### Отличия от запроса автора
- **Хук срабатывает только на `.ts/.tsx/.js/.jsx`.** Правка `.md` или конфигов typecheck не запускает: на нетиповых файлах это лишние десятки секунд на каждую правку.
- **Lint запускается только по изменённому файлу**, а не по всему проекту (`yarn eslint <file>` вместо `yarn lint`). Typecheck идёт по всему проекту, иначе межфайловые ошибки не поймать. Полный `yarn lint` входит в definition of done.
- **Мастер `/agents` удалён из Claude Code.** Проверка «сабагент виден в `/agents`» из плана невозможна. Сабагенты подхватываются только при старте сессии, поэтому ревьюер стал доступен после перезапуска. Проверкой стал его реальный прогон.

### Ревьюер: первый прогон — 8 замечаний, все исправлены
| # | Замечание | Исправление |
|---|-----------|-------------|
| 1 | Ревьюер считал нарушением любой импорт между слайсами одного слоя, хотя `CLAUDE.md` и R-10 разрешают его через `index.ts`. **Ошибка агента** | Нарушение — только импорт в обход `index.ts` |
| 2 | Нет инварианта для `/posts/{id}` (R-3) | Инвариант 3 в `CLAUDE.md`, отдельный пункт в чеклисте ревьюера |
| 3 | Ревьюер не проверял T-* и S-* | Проверка требований охватывает T/F/D/S/I/R |
| 4 | Запрет кнопки сброса (R-4) не попал в запреты | Добавлен в запреты и в инвариант 5 |
| 5 | Хуку нужен `jq`, без него проверки молча пропускаются | `jq` заменён на `node -e` |
| 6 | `yarn -s` может не работать в Yarn Berry | **Подтверждено**: Yarn 4.18.1 отвечает `Unsupported option name ("-s")`, хук упал бы на каждой правке. Флаг убран. **Ошибка агента**: флаг перенесён из Yarn Classic без проверки |
| 7 | `docs/requirements.md` не попадал ни под одно правило языка | Русский — для README и всей папки `docs/` |
| 8 | Запрет изменений у ревьюера держался только на тексте промпта | `Bash` ограничен read-only командами git прямо в `tools` |

### Ревьюер: второй прогон — 5 замечаний
| # | Замечание | Итог |
|---|-----------|------|
| 1 | Нет записи этапа 2 в журнале | Закрыто этой записью |
| 2 | Без Node хук падал на любой правке, даже когда проекта нет: проверка `node` стояла раньше проверок `package.json` и `node_modules` | Порядок проверок изменён. Без проекта хук выходит с кодом 0 и без Node |
| 3 | В `CLAUDE.md` нет инварианта R-3 и запрета кнопки сброса | **Ложное срабатывание**, см. ниже |
| 4 | `docs/requirements.md` не попадает под правило языка | **Ложное срабатывание**, см. ниже |
| 5 | Решение по языку UI (Q17, Q18) не прослеживается в `requirements.md`: R-14 ссылался только на Q15 | Заголовок R-14 → «Q15, Q17, Q18» |

**Ложные срабатывания и вывод.** Пункты 3 и 4 описывали `CLAUDE.md` в состоянии до исправлений, номера строк в отчёте совпадали со старой версией файла. Скорее всего, сабагент получил `CLAUDE.md` в виде, загруженном при старте сессии, а не текущий файл с диска. Вывод: в `reviewer.md` добавлен обязательный первый шаг — читать `CLAUDE.md` и `docs/requirements.md` с диска через Read и указывать номера строк по актуальному файлу.

Третий прогон в этой сессии не делался: пока сессия не перезапущена, ложные срабатывания повторились бы. Чистый прогон ревьюера — первый шаг следующей сессии.

---

## Этап 3. Архитектура — 2026-10-07…08

### Сделано
- Создан [`docs/architecture.md`](../architecture.md):
  - FSD: дерево `src/`, слайсы с ответственностью, public API и импортами;
  - модели: `PostDto` (контракт API), `ValidatedPostDto`, `Post`, `PostDetails`, `FavoritesMap`;
  - два persist-стора, трекер гидрации и gate;
  - потоки данных с mermaid-диаграммами запуска и деталей;
  - ADR: Zustand + MMKV, FSD, одна картинка из общего seed, Yarn Berry, без TanStack Query;
  - способ проверки каждого инварианта: юнит-тест, lint или структурная гарантия;
  - трассировка «требование → модуль».
- В [`docs/requirements.md`](../requirements.md) изменены I-1, I-3, R-2, R-3, R-4, R-6, R-7, R-9, R-10, R-13, допущения для README, таблица неоднозначностей (A16, A17). Q19 и Q20 закрыты.
- В [`CLAUDE.md`](../../CLAUDE.md) уточнены инварианты 1, 2, 4, в стек добавлен `eslint-plugin-boundaries`.
- В [`.claude/agents/reviewer.md`](../../.claude/agents/reviewer.md) добавлены две проверки, на которые ссылается раздел 6 архитектуры: нет action'а очистки и `removeItem` вне трекера; `savePostList` только в `features/load-posts`.
- DoD: `yarn typecheck` / `lint` / `test` на этом этапе неприменимы, RN-проекта ещё нет.

### Проверено агентом
| Что | Как | Результат |
|-----|-----|-----------|
| Гидрация `persist` в zustand 5.0.15 | исходник `persistImpl` + скрипт со стором в памяти | с синхронным хранилищем гидрация завершается внутри `create`; при битом JSON и исключении в `migrate` ошибка приходит в пост-колбэк `onRehydrateStorage`, стор остаётся в начальном состоянии, `hasHydrated()` навсегда `false`; пост-колбэк вызывается до того, как `create` вернул стор |
| `@faker-js/faker` 10.6 | `npm view` | только ESM (`"type": "module"`), в `exports` есть условие `default`. На этапе каркаса: `@faker-js` в `transformIgnorePatterns` Jest и проверка сборки в Metro |
| ESLint в шаблоне RN 0.87.1 | `npm pack @react-native-community/template@0.87.1` | ESLint `^8.19`, `.eslintrc.js` с `extends: '@react-native'`, flat config не используется |
| `eslint-plugin-boundaries` 7.2.0 | тестовое дерево `src/` в scratchpad, ESLint 8.57.1 | ловит импорт вверх, глубокий относительный импорт из соседнего слайса и глубокий импорт через имя слоя; импорт соседнего слайса через `index.ts`, импорты внутри слайса и тест рядом с модулем проходят. Старые имена правил и строковые селекторы в 7.x устарели — конфиг пишется в синтаксисе `boundaries/dependencies` + `policies` |

### Решения автора
| Вопрос | Решение | Где |
|--------|---------|-----|
| URL 300×300 появлялся только после `/posts/{id}`, а экран показывает пост сразу (противоречие R-2/R-3) | URL собирается из сохранённого seed чистой функцией и виден сразу; после успеха `/posts/{id}` сохраняется в детали | R-2, R-3, I-3, инвариант 2 |
| Устройство сторов и gate | два стора по сущностям, `partialize` без статусов, явный gate | R-9 |
| Где загрузка деталей и сортировка | `features/load-post-details`; сортировка в `widgets/posts-list/model`; `PostCard` получает `isFavorite` пропсом | R-10 |
| Тесты сверх R-13 | способ проверки у каждого инварианта: юнит-тест, lint или структурная гарантия | R-13 |
| Индикация фонового запроса деталей | не показывается, ошибка только в dev-логе | I-1, R-3 |
| Пустой ответ `/posts` | не успех: «No posts» + Retry; невалидная структура — ошибка. Валидация проверяет только структуру, пустоту обрабатывает `loadPosts` | R-4, инвариант 1 |
| Типы маршрутов в `app` давали импорт вверх | `shared/config/navigation`, навигацией управляют только `pages` | R-10 |
| Иконки без иконочного пакета | ★ / ☆ в `shared/ui/StarIcon` | R-6, R-7 |
| **Q19.** Gate при ошибке гидрации ждал вечно | ошибка = данных нет: трекер удаляет ключ, gate ждёт собственный признак завершения; пока ждёт — пустой `View`; восстановление по каждому стору отдельно | R-9, инвариант 4, допущения |
| **Q20.** `userId` в типе, но не проверяется | `PostDto` — контракт API; `Post` = `id`, `title`, `body` + `seed`, `thumbnailUrl`; валидаторы возвращают `ValidatedPostDto` | R-4 |
| Обогащение можно было вызвать при рендере через public API | `enrichPosts` убран из public API, наружу — только `savePostList` / `savePostDetails`; где вызывается `savePostList`, проверяет ревьюер | R-10, R-13 |
| Хранилище в трекере было зашито | `createHydrationTracker(storage, key)` | R-9 |
| Проверка FSD | после двух багов в самописных шаблонах `no-restricted-imports` — `eslint-plugin-boundaries` (одобрена новая dev-зависимость); `no-restricted-imports` остаётся только для faker | ADR-2, R-10, R-13 |
| Тест валидации | `validate.test.ts` — тест чистой функции в `lib`, исключение R-13 касается только api-слоя | R-13 |
| Пост отсутствует в списке при сохранении деталей | защитное поведение: ничего не сохраняется, dev-предупреждение; путь недостижим | R-3 |
| `id` ответа ≠ запрошенному `postId` | невалидный ответ, обрабатывается как ошибка; кэш и сохранение — по запрошенному `postId` | R-3 |
| Правило работы до конца этапа | о неточностях текста, типизации и недостижимых случаях не спрашивать — решать в рамках принятых решений и фиксировать здесь | — |

### Решено агентом в рамках принятых решений
- **`userId` отбрасывается в валидаторе.** `Pick<>` сужает только тип, поэтому валидатор возвращает новый объект только с проверенными полями. Маппер принимает `ValidatedPostDto`. Тест «`userId` не попадает» перенесён из `enrich.test.ts` в `validate.test.ts`.
- **Элементы `shared` для boundaries** — модули с собственным `index.ts` (`shared/lib/storage`, `shared/config/navigation`), а не сегменты. Иначе импорт `shared/lib/storage` считался бы глубоким.
- **`loadPostDetails(postId, deps)`** с внедрёнными зависимостями, по образцу `loadPosts`. `Set` запросов в полёте тоже передаётся аргументом: тесты получают свежий `Set`, хук — один на модуль.
- **`saveDetails(postId, details)`** — ключ передаётся явно.
- **Сброс стора при ошибке гидрации не делается явно.** Стор и так в начальном состоянии, а `setState` записал бы данные обратно в удалённый ключ. Автор просил «сбросить стор», итог тот же, тест проверяет результат.
- **Lint на `clearStorage` / `clearAll`** добавлен к запрету pull-to-refresh: инвариант 5 касается и кнопки сброса.
- **Защита от двойного запроса деталей** (StrictMode в dev монтирует эффект дважды), покрыта тестом.
- **Адаптер `StateStorage`** реализует `removeItem → remove` по контракту `persist`. В чеклисте ревьюера это явное исключение из правила «`remove` только в трекере».
- **Алиасов путей нет.** Для них нужен `babel-plugin-module-resolver`, его нет в стеке, поэтому проверка «глубокий импорт по алиасу» на этапе каркаса неприменима. Остальные три примера остаются.

### Отклонено
| Что | Почему |
|-----|--------|
| Один общий стор | одна гидрация, но стор знает обо всех сущностях и не ложится на FSD-слайсы |
| Сортировка в `features` или `entities` | не действие пользователя; в `entities` одна сущность зависела бы от другой |
| Картинка 300 только после ответа `/posts/{id}` | без сети картинки не было бы вовсе |
| Проверка гидрации в `loadPosts` / `loadPostDetails` | дублирует gate; инвариант 4 держится на gate, его логику проверяет тест |
| Опора gate на `persist.hasHydrated()` | при ошибке гидрации навсегда `false` |
| Самописные шаблоны `no-restricted-imports` для FSD | настройки в `overrides` замещают друг друга; относительный импорт из соседнего слайса не содержит имени слоя |
| Иконочный пакет, `react-native-svg` | новая зависимость, хватает unicode-символов |

### Ревьюер: шесть прогонов
| Прогон | Замечаний | Ошибки агента, которые нашёл ревьюер | Итог |
|--------|-----------|--------------------------------------|------|
| 1 | 14 | селектор Zustand возвращал новый объект (бесконечный ре-рендер); запрет импортов между слайсами одного слоя, которого нет в R-10 | 6 решений автора, остальное исправлено |
| 2 | 13 | `onRehydrateStorage` описан как пост-колбэк, а это фабрика: признак гидрации ставился бы до чтения данных, восстановление не срабатывало бы; ADR-2 обещал lint для FSD, которого не было | решения автора по Q20-модели, lint FSD, public API, трекеру |
| 3 | 6 | настройки `no-restricted-imports` в `overrides` затирают друг друга | исправлено; faker ESM проверен |
| 4 | 6 | — | 3 текстовых исправлено, 2 решения автора (тест валидации, защитное поведение), 1 опровергнут проверкой npm |
| 5 | 6 | относительный импорт из соседнего слайса обходит шаблоны; чеклист ревьюера не содержал проверок, на которые ссылалась архитектура | `eslint-plugin-boundaries`; проверка `id` деталей; `ValidatedPostDto` |
| 6 | 8 | — | только текст и типизация, исправлено агентом по правилу автора, этап закрыт |

**Вывод.** Самые дорогие ошибки были в утверждениях о чужих библиотеках, сделанных без запуска: сигнатура `onRehydrateStorage`, слияние настроек ESLint, покрытие относительных путей. Там, где агент проверял запуском (гидрация zustand, boundaries на ESLint 8), утверждения выдержали все прогоны.

### Открытые вопросы
Нет.

### Перенесено на этап каркаса
- Сборка RN 0.87.1 + MMKV 4.3 + Nitro на обеих платформах (R-9).
- Конфиг `eslint-plugin-boundaries` в синтаксисе `policies`, проверка трёх примеров нарушений на реальном конфиге.
- `@faker-js` в `transformIgnorePatterns` Jest и сборка faker в Metro на обеих платформах.

### Артефакты
- [`docs/architecture.md`](../architecture.md)
- [`docs/ai/prompts/03-architecture.md`](prompts/03-architecture.md)
- `docs/ai/sessions/03-architecture.md` — экспорт сессии делает автор

---

## Этап 4. Каркас — 2026-10-08

### Сделано
- Проект создан через `npx @react-native-community/cli@20.2.0 init LoremFeed --version 0.87.1` во временной папке (шаблон `@react-native-community/template` 0.87.2, он ставит RN 0.87.1). Перенесён в корень через `rsync --ignore-existing`: `docs/`, `.claude/`, `CLAUDE.md`, `README.md` не тронуты.
- Имя нативного проекта `LoremFeed`, отображаемое имя `lorem-feed`, идентификатор приложения `com.loremfeed` на обеих платформах.
- Из шаблона удалены демо-части: `App.tsx`, `__tests__/App.test.tsx`, `@react-native/new-app-screen`, `react-test-renderer`, `@types/react-test-renderer`. Компонентных тестов в плане нет (R-13).
- Тулчейн (R-11, I-10): `packageManager: yarn@4.18.1` (через `corepack use`), `.yarnrc.yml` с `nodeLinker: node-modules`, `.nvmrc` 24.14.0, `engines.node` `^22.13.0 || ^24.3.0`. `postinstall` → `scripts/postinstall.js`: на macOS `bundle install` и `bundle exec pod install`, на остальных ОС — выход.
- Все версии в `package.json` точные, без диапазонов.
- TypeScript: `strict: true` явно, `paths` `@/*` → `./src/*`. Babel: `babel-plugin-module-resolver` с `@` → `./src`. ESLint: резолвер `eslint-import-resolver-typescript` по `tsconfig.json`.
- ESLint (`.eslintrc.js`): `@react-native` + `eslint-plugin-boundaries` (политики из architecture 6.2), запрет faker (`paths` + `patterns` для подпутей) с `override` для `enrich.ts` / `enrich.test.ts`, запрет `onRefresh` / `refreshControl`, `clearStorage` / `clearAll`.
- FSD: `src/` с `index.ts` в каждом слайсе и модуле `shared`, навигация native-stack (`app/navigation/RootStack`, `app/providers/AppProviders`), типы маршрутов и `ROUTES` в `shared/config/navigation`, экраны-заглушки `PostsScreen` и `DetailsScreen`.
- Jest: `transformIgnorePatterns` с исключениями для `@faker-js`, React Navigation, screens, safe-area, MMKV, Nitro. Постоянный тест-заглушка `shared/config/navigation/routes.test.ts`.
- Prettier: `.prettierignore` исключает `vendor/`, нативные папки, `.yarn/`, `yarn.lock` и `*.md`. Без него `yarn format` переформатировал бы гемы из `vendor/bundle` и документы. `prettier --check .` чистый.
- CI: `.github/workflows/ci.yml` (Node из `.nvmrc`, `corepack enable`, `yarn install --immutable`, typecheck, lint, test). На GitHub не запускался: push делает автор.
- Документы:
  - `CLAUDE.md`: стек с точными версиями, правило `@/`, правило об одобрении пакетов шаблона;
  - `requirements.md`: R-9, R-10, R-11, R-13;
  - `architecture.md`: разделы 1.1, 1.2, 1.3 (public API `app`), 6.2, ADR-1, ADR-2, ADR-3.

### Точные версии
| Пакет | Версия |
|-------|--------|
| `react-native` / `react` | 0.87.1 / 19.2.3 |
| `@react-native-community/cli` (+ platform-ios/android) | 20.2.0 |
| `@react-native/*` (babel-preset, eslint-config, jest-preset, metro-config, typescript-config) | 0.87.1 |
| `@react-navigation/native` / `native-stack` | 7.5.0 / 7.20.0 |
| `react-native-screens` / `react-native-safe-area-context` | 4.28.0 / 5.10.1 |
| `@faker-js/faker` | 10.6.0 |
| `zustand` | 5.0.15 |
| `react-native-mmkv` / `react-native-nitro-modules` | 4.3.2 / 0.37.1 |
| `typescript` | 6.0.3 |
| `eslint` / `prettier` / `jest` | 8.57.1 / 2.8.8 / 29.7.0 |
| `eslint-plugin-boundaries` | 7.2.0 |
| `babel-plugin-module-resolver` / `eslint-import-resolver-typescript` | 5.0.3 / 4.4.5 |
| `@babel/core`, `@babel/preset-env`, `@babel/runtime` | 7.29.7 |
| `@types/jest` / `@types/react` | 29.5.14 / 19.3.0 |
| Yarn / Node (локально) | 4.18.1 / 24.14.0 |
| Xcode / CocoaPods / JDK / Gradle | 26.3 / из `Gemfile.lock` / 21 / 9.4.1 |

### Изменённое решение: алиас `@/`
- **Было (этап 3):** алиасов нет, потому что `babel-plugin-module-resolver` не в стеке.
- **Стало:** один алиас `@/` → `src/`, без алиасов по слоям. Решение автора 2026-10-08, причина — читаемость импортов между слоями. Одобрены dev-зависимости `babel-plugin-module-resolver` и `eslint-import-resolver-typescript`.
- Запрос автора начинался с «алиасы по FSD-слоям». Агент спросил, потому что это противоречило архитектуре, и автор заменил их одним общим алиасом.

### Проверка lint-правил на реальном конфиге
Временные файлы в `src/`, `yarn eslint src`, после проверки файлы удалены.

| # | Пример | Файл → импорт | Результат |
|---|--------|---------------|-----------|
| 1 | импорт вверх через алиас | `entities/post/model` → `@/features/load-posts` | ошибка «R-10: entities must not import upper layers» |
| 2 | импорт вверх относительным путём | `entities/post/model` → `../../../features/load-posts` | та же ошибка |
| 3 | `shared` → `entities` | `shared/ui` → `@/entities/post` | ошибка «R-10: shared must not import upper layers» |
| 4 | глубокий импорт в чужой слайс через алиас | `widgets/posts-list/model` → `@/entities/post/lib/enrich` | ошибка «R-10: import another slice only through its public API (index.ts)» |
| 5 | глубокий относительный импорт из соседнего слайса | `entities/favorite/model` → `../../post/lib/enrich` | та же ошибка |
| 6 | faker вне модуля обогащения | `entities/favorite/model` → `@faker-js/faker` и `@faker-js/faker/locale/en` | ошибка «Invariant 2 (R-2)» (для подпути — через `patterns`) |
| 7 | pull-to-refresh и сброс | `<FlatList onRefresh refreshControl>`, `storage.clearAll()` | две ошибки «Invariant 5 (R-4): no pull-to-refresh», одна «no data reset» |
| 8 | контроль | faker в `entities/post/lib/enrich.ts` и `enrich.test.ts`; соседний слайс через index (`@/entities/post` и `../../post`); импорт вниз (`features` → `@/entities/post`, `@/shared/config/navigation`); относительный импорт внутри слайса; тест рядом с модулем | без ошибок |

Итого 10 ошибок на 10 ожидаемых нарушений, ни одной на контрольных файлах. Ревьюер сомневался, что ключ `types` в селекторах `boundaries` валиден. Таблица это снимает: политики 1, 2 и 4 сработали со своими сообщениями.

### faker: Jest и Metro
- **Jest:** временный `src/entities/post/lib/enrich.test.ts` с `faker.seed` и `faker.string.alphanumeric` прошёл, затем удалён. Настоящий тест пишется на этапе 5.
- **Metro:** временный entry с импортом faker. `react-native bundle --dev false` для `ios` и `android` собрался (~2,7 МБ), бандлы скомпилированы `hermesc` из `hermes-compiler` без ошибок.
- **Наблюдение для этапа 5:** `import { faker } from '@faker-js/faker'` тянет все локали. Если взять `@faker-js/faker/locale/en`, бандл станет меньше. Lint-запрет покрывает оба пути.

### Сборка на платформах
- **iOS:** `yarn ios` на iPhone 17 Pro (iOS 26.3) — сборка успешна, приложение стартует. Скриншот: [`04-scaffold-ios-posts.png`](screenshots/04-scaffold-ios-posts.png). Переход на Details на iOS не нажимался: в окружении нет инструмента для тапов в симуляторе. JS тот же, что на Android.
- **Android:** `yarn android` на эмуляторе Pixel_8_Pro (API 37) — `BUILD SUCCESSFUL in 11m 7s`. Первая сборка долгая из-за CMake для Nitro и MMKV на четыре ABI. Переход Posts → Details работает. Скриншоты: [`04-scaffold-android-posts.png`](screenshots/04-scaffold-android-posts.png), [`04-scaffold-android-details.png`](screenshots/04-scaffold-android-details.png).
- **Проблемы при запуске:**
  - iOS — не было: первая сборка прошла без ошибок, повторная после смены bundle id тоже;
  - Android — один системный запрос разрешения, см. «Проблемы и как решены».
- **MMKV 4.3.2 + Nitro 0.37.1 с RN 0.87.1** собираются на обеих платформах. Это была проверка, перенесённая с этапа 3 (R-9).

### Проблемы и как решены
- **`corepack use` поставил зависимости в режиме PnP:** `.yarnrc.yml` ещё не было. Удалены `.pnp.cjs`, `.pnp.loader.mjs`, `.yarn/unplugged`, добавлен `nodeLinker: node-modules`, установка повторена.
- **Запрос «nearby devices» при первом запуске на Android:** это `ACCESS_LOCAL_NETWORK` из debug-манифеста `react-android` 0.87.1, нужен для доступа к dev-серверу на Android 17. В release-манифест не попадает, в нашем манифесте только `INTERNET`. Ничего не меняли.
- **Предупреждения, оставленные как есть, — все из зависимостей, не из нашего кода:**
  - Yarn: peer-зависимости, которые неверно удовлетворены внутри `@react-native/eslint-config` и `@react-native/jest-preset` (typescript, `@babel/core`);
  - Metro: `ReactNativeFeatureFlags` вне `exports` у `react-native`;
  - Gradle: устаревшие `android.builtInKotlin` / `android.newDsl`.

### Ревьюер: три прогона

**Прогон 1** (до коммита каркаса) — 8 замечаний.

| # | Замечание | Итог |
|---|-----------|------|
| 1 | ключ `types` в селекторах boundaries может не работать | опровергнуто проверкой lint (таблица выше) |
| 2 | ADR-2 не упоминает две новые dev-зависимости | исправлено |
| 3 | ADR-3 описывал проверку faker в будущем времени | исправлено, результат записан |
| 4 | результат сборки MMKV/Nitro не записан в R-9 и ADR-1 | исправлено |
| 5 | решение этапа 3 «алиасов нет» не помечено как заменённое | раздел «Изменённое решение» выше |
| 6 | `postinstall` вызывает `bundle install`, а R-11 говорит только о `pod install` | оставлено, как рекомендует шаблон: `Gemfile` фиксирует CocoaPods. R-11 уточнён |
| 7 | у iOS был bundle id из шаблона | `com.loremfeed`, как на Android, iOS пересобран |
| 8 | дубли в `.gitignore` | убран добавленный агентом дубль `.idea/`; дубль `build/` — из шаблона, оставлен |

**Прогон 2** (после коммита каркаса, по запросу автора) — 4 замечания, решения автора:

| # | Замечание | Решение автора | Итог |
|---|-----------|----------------|------|
| 1 | в git лежат 5 файлов `.idea/` (из коммита автора `12f6ae6`), в `noctule.xml` локальный путь к Xcode | убрать из git отдельным коммитом | `git rm --cached -r .idea`, коммит `fbd0dea chore: remove IDE files from git`. `.gitignore:28` (`.idea`) их покрывает, проверено `git check-ignore` |
| 2 | в architecture 1.2/1.3 у `app` нет public API, а `src/app/index.ts` экспортирует `App` для корневого `index.js` | поправить документ | 1.2 и 1.3 исправлены |
| 3 | в Stack `CLAUDE.md` не названы пакеты шаблона (`@babel/*`, `@types/*`, `@react-native/*`, `cli-platform-*`), поэтому фраза «новых зависимостей вне стека нет» не обоснована | все пакеты шаблона RN CLI одобрены целиком | в Stack добавлено: «Everything installed by the RN CLI template is approved; the approval rule applies to packages added on top of it» |
| 4 | нет экспорта сессии этапа 4 | экспорт делает автор | отмечено в «Артефактах» |

**Прогон 3** (после правок) — все 4 решения подтверждены, 2 замечания к журналу:
- в журнале нет коммита `fbd0dea`, второго прогона и решений по нему;
- неточная формулировка про `postinstall` («Yarn/Corepack… как в шаблоне»).

Оба исправлены в этой записи. Замечаний к коду и конфигам нет.

### Отклонения от запроса
- **Алиасы.** Пункт 3 просил «алиасы по FSD-слоям». Агент спросил, потому что это противоречило architecture 6.2, где алиасов не было. Автор заменил их одним алиасом `@/` → `src/` (раздел «Изменённое решение» выше).
- **`eslint-plugin-boundaries`** — не отклонение. Он есть в запросе (пункт 4) и одобрен автором на этапе 3 (2026-10-08).
- **«Исключение для тестов» (пункт 4)** сделано так: `override` снимает запрет faker для `enrich.test.ts` (и `enrich.ts`). Для `boundaries` отдельное исключение не понадобилось: тест рядом с модулем — тот же элемент, проверено (пример 8). Тестовые глобалы Jest уже даёт `@react-native` для `*.test.*`.
- **Ссылка на требование.** В запросе Yarn Berry отнесён к R-12, на деле это R-11. Работа шла по R-11.
- **`.nvmrc`** фиксирует точную версию 24.14.0 (локальная), `engines` допускает диапазон из `CLAUDE.md`.
- **Сделано агентом без отдельного запроса:**
  - `.prettierignore` и скрипт `format`;
  - iOS bundle id `com.loremfeed` вместо шаблонного, по замечанию ревьюера;
  - удалены демо-зависимости шаблона;
  - faker-запрет расширен на подпути;
  - `scripts/postinstall.js` ставит поды через Bundler (`bundle install`, `bundle exec pod install`). В шаблоне `postinstall` нет, но в инструкциях после `init` шаблон рекомендует ставить поды именно так.

**Зависимости, добавленные к шаблону RN, с причиной.** Новых зависимостей вне одобренного стека нет.

| Пакет | Тип | Причина | Одобрено |
|-------|-----|---------|----------|
| `@react-navigation/native`, `@react-navigation/native-stack` | dep | навигация (T-3) | стек, этап 1 |
| `react-native-screens` | dep | peer native-stack | стек, этап 1 |
| `react-native-safe-area-context` | dep | peer навигации; есть в шаблоне, версия поднята до 5.10.1 и зафиксирована | стек, этап 1 |
| `@faker-js/faker` | dep | seed картинок (T-4, R-2) | стек, этап 1 |
| `zustand` | dep | state-manager (T-5, R-9) | стек, этап 1 |
| `react-native-mmkv`, `react-native-nitro-modules` | dep | хранилище persist (R-9); Nitro — peer MMKV | стек, этап 1 |
| `eslint-plugin-boundaries` | dev | правило импортов FSD (R-10) | автор, этап 3 |
| `babel-plugin-module-resolver` | dev | алиас `@/` в Metro и Jest | автор, этап 4 |
| `eslint-import-resolver-typescript` | dev | резолв `@/` для `boundaries` | автор, этап 4 |

Удалены из шаблона: `@react-native/new-app-screen`, `react-test-renderer`, `@types/react-test-renderer` — их использовали только демо-экран и демо-тест.

### Ошибки агента и правки автора
Свои ошибки агент нашёл сам или через ревьюера, до проверки автором. Ошибок агента автор на этом этапе не поправлял.

| Ошибка агента | Кто нашёл | Исправление |
|---------------|-----------|-------------|
| `corepack use` запущен до создания `.yarnrc.yml`, зависимости встали в PnP | агент, по выводу Yarn | удалены файлы PnP, добавлен `nodeLinker`, установка повторена |
| в черновике `.eslintrc.js` запрет «импорт вверх» включал свой слой; он запретил бы импорт соседнего слайса через `index.ts` и импорты внутри слайса | агент, при перечитывании конфига до первого запуска lint | запрет только для слоёв строго выше |
| запрет faker покрывал только `@faker-js/faker`, а не подпути (`@faker-js/faker/locale/en`) | агент, при проверке бандла Metro | добавлены `patterns`, пример 6 проверяет оба пути |
| iOS bundle id остался из шаблона | ревьюер | `com.loremfeed` |
| дубль `.idea/` в `.gitignore` | ревьюер | убран |
| ADR-2, ADR-3, R-9 не обновлены после проверок | ревьюер | обновлены |

**Решения автора по вопросам агента:**
- один алиас `@/` вместо алиасов по слоям и одобрение двух dev-зависимостей;
- порядок проверки чистого клона: автор сам коммитит этап 3; агенту — один коммит каркаса; исправления по итогам клона — отдельным коммитом; без push.

### Чистый клон
Коммит `f5e34fe chore: scaffold React Native project`. Затем `git clone` локального репозитория во временную папку и проверки в ней:
- `yarn install`: Yarn 4.18.1 из `packageManager`, 1 мин 46 с, включая `bundle install` и `pod install` в `postinstall`;
- `yarn typecheck`, `yarn lint`, `yarn test`: зелёные (1 suite, 1 test).

Ничего не упало, исправлять было нечего, коммита с исправлениями по итогам клона нет.

**Коммиты этапа:**
- `f5e34fe chore: scaffold React Native project`;
- `fbd0dea chore: remove IDE files from git` — по решению автора после прогона 2 ревьюера, к чистому клону не относится.

Запись журнала и правки документов после прогона 2 не закоммичены.

Предупреждение Yarn `unrs-resolver lists build scripts, but all build scripts have been disabled`: в Yarn 4.18 `enableScripts` по умолчанию `false`. Скрипт `unrs-resolver` — только запасной путь на случай, если нет готового бинарника. Lint в клоне работает. Других зависимостей со скриптами установки нет. Собственный `postinstall` проекта выполняется.

### Артефакты
- Каркас проекта (корень репозитория), [`docs/ai/prompts/04-scaffold.md`](prompts/04-scaffold.md), скриншоты `docs/ai/screenshots/04-scaffold-*`.
- `docs/ai/sessions/04-scaffold.md` — экспорт сессии делает автор.

## Этап 5. Данные и состояние — 2026-10-08

План этапа согласован с автором до начала работы: три подшага, после каждого — typecheck / lint / test и отдельный коммит.

### 5.1 shared + entities

Сделано: `shared/api` (`fetchJson`, `API_BASE_URL`), `shared/lib/storage` (`mmkvStorage`, `createHydrationTracker`), `entities/post` (DTO, валидация, маппер, `buildImageUrl`, обогащение, стор, селекторы, `usePostView`, `savePostList` / `savePostDetails`), `entities/favorite` (стор, `toggle`, `selectIsFavorite`). Тесты: `validate.test.ts`, `enrich.test.ts`, `createHydrationTracker.test.ts`.

**Решения при реализации** (документ оставлял их на этап 5, план с ними одобрен автором):
- **Точка импорта faker** (ADR-3): `@faker-js/faker/locale/base`. Для `string.alphanumeric` данные локали не нужны, а импорт из корня пакета тянет все локали. Lint-конфиг не менялся: override для `enrich.ts` снимает запрет faker целиком.
- **Длина seed** (R-2): `SEED_LENGTH = 10`.
- **Размеры картинок** вынесены в сегмент `entities/post/config/imageSizes.ts`. Иначе `usePostView` импортировал бы константу из `lib/enrich.ts` и тянул бы модуль с faker в путь рендера.
- **`selectIsFavorite`** лежит рядом со стором в `entities/favorite/model/store.ts`. Отдельный файл для одного селектора не нужен.

**Неочевидное:**
- Тип `onRehydrateStorage` трекера сделан generic (`<S>() => (state: S | undefined, error?) => void`). С `state: unknown` TypeScript выводил из него тип состояния `persist` как `unknown`, и сторы не типизировались.
- В Jest `createMMKV` сам возвращает мок (проверка `isTest()` в `react-native-mmkv` 4.3.2), отдельный `jest.mock` не нужен.
- Тест трекера работает на реальном `persist` с хранилищем в памяти. Ветка «`migrate` бросает» проверяется так: сохранено `version: 1`, у стора `version: 2`.

### 5.2 Gate гидрации

Сделано: `app/hydration/model/hydrationGate.ts` (`isGateOpen`, `createHydrationGate`, чистые, без React), `app/hydration/model/gate.ts` (объект gate на уровне модуля с трекерами `post` и `favorite`, `useStoresHydrated`), `app/hydration/ui/HydrationGate.tsx`. Тест: `hydrationGate.test.ts` с фейковыми трекерами.

**Решения и отклонения:**
- Gate стоит в `AppProviders` между `SafeAreaProvider` и `NavigationContainer`: пока он закрыт, не рендерится даже контейнер навигации (как в 4.1).
- Gate и хук вынесены в отдельный файл `gate.ts`, чтобы тест импортировал только чистые функции и не тянул сторы.
- **Временное отклонение от 3.3:** пока gate закрыт, показывается `View` с `flex: 1` без фона темы. `shared/theme` появится на этапе UI, тогда же появится и фон.

### 5.3 features, селектор, заглушки

Сделано: `features/load-posts` (`loadPosts` с зависимостями аргументом, `useLoadPosts`), `features/load-post-details` (`loadPostDetails` с `inFlight`, `useLoadPostDetails` с одним `Set` на модуль), `features/toggle-favorite` (`useToggleFavorite`, `ToggleFavoriteButton`), `widgets/posts-list` (`sortPosts`, `useSortedPosts`, `PostsList`). Тесты: `loadPosts.test.ts`, `loadPostDetails.test.ts`, `sortPosts.test.ts`.

**Решения и отклонения:**
- `useLoadPosts` возвращает `{ status, isListLoaded, retry }`, а не `{ status, retry }`, как в 4.2. По таблице 4.5 виджету нужен флаг `isListLoaded`: только он отличает «список» от «idle до эффекта». Через хук фичи виджет получает его, не читая стор напрямую.
- `loadPosts` в dev-сборке логирует ошибку `fetchPosts` (`console.warn`), так же как `loadPostDetails`. Пользователь видит экран ошибки, а лог помогает при отладке.
- Чистые модули (`loadPosts.ts`, `loadPostDetails.ts`, `sortPosts.ts`) импортируют из `@/entities/*` только типы (`import type`). Тесты не загружают сторы.
- **Заглушки UI для ручной проверки** (по запросу автора): `PostsList` — голый `FlatList` (ключ `id`, без refresh-пропсов), в строке ★/☆ текстом и заголовок, состояния loading / error / empty текстом и кнопкой Retry. `ToggleFavoriteButton` — RN `Button` «★ In favorites» / «☆ Add to favorites». `DetailsScreen` — заголовок из `usePostView`, кнопка и `useLoadPostDetails`. `StarIcon`, `PostCard`, `StateView`, `RemoteImage`, анимация и тема — этап UI.
- Проверка бандла: `react-native bundle --platform ios --dev false` собирается, размер всего бандла 1,4 МБ (в ADR-3 оценка бандла с корневым импортом faker — около 2,7 МБ). Импорт подпути `@faker-js/faker/locale/base` Metro резолвит через `exports` пакета.

### Ревьюер

**Прогон 1** (после трёх коммитов подшагов): нарушений FSD и инвариантов нет, все 7 тест-файлов из 6.1 на месте и покрывают все случаи, все заявленные отклонения есть в журнале. 5 замечаний (все minor):

| # | Замечание | Итог |
|---|-----------|------|
| 1 | фон темы у gate отсутствует | заявленное временное отклонение, закрывается на этапе UI |
| 2 | `fetchJson` использует `response.json()`, а не `JSON.parse` (1.3), не записано | записано здесь: поведение то же (оба бросают на невалидном JSON), `response.json()` — стандартный путь `fetch` |
| 3 | public API `shared/lib/storage` экспортирует ещё тип `HydrationTracker`, не записано | записано здесь: тип нужен `app/hydration/model/hydrationGate.ts`, это только тип |
| 4 | `createMMKV({ id: 'lorem-feed' })` вместо `createMMKV()` | исправлено по документу: `createMMKV()` |
| 5 | `savePostList` вызывался вне `try`: при исключении (обогащение, запись в хранилище) `listStatus` навсегда оставался `loading`, guard блокировал Retry, промис отклонялся без обработки | исправлено: `savePostList` внутри `try`, исключение → `error`, повтор возможен. Добавлен тест «сохранение бросает → `error`, повтор сохраняет». Инвариант 1 не нарушался: при исключении ничего не сохранялось |

Итог: typecheck / lint / test зелёные, 8 suites, 44 теста.

### Коммиты этапа
- `5fc025f feat: add post and favorite entities with persisted stores`
- `99b10db feat: gate navigation on store hydration`
- `da6f2c8 feat: add loading, favorite toggle and sorted posts list`
- `fix: recover posts loading when saving the list fails` — исправления по ревьюеру

### Артефакты
- `docs/ai/sessions/05-data-state.md` и `docs/ai/prompts/05-data-state.md` — экспорт сессии и извлечение промптов делает автор.
- Ручной запуск на устройствах и скриншоты — не выполнялись на этом этапе (заглушки UI готовы для ручной проверки).
