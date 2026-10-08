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

**Язык UI (Q17, Q18).** Автор давал подписи по-русски («Повторить», «В избранное»), а UI по требованиям на английском. Агент не стал переводить сам и спросил. Итоговое правило: весь UI на английском, русские формулировки автора передают смысл, а не готовые строки («Retry», «Add to favorites» / «In favorites»; позже изменено, см. 6.5).

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
- [`docs/ai/sessions/03-architecture.md`](sessions/03-architecture.md)

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
- [`docs/ai/sessions/04-scaffold.md`](sessions/04-scaffold.md)

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
- `6dc75d3 fix: recover posts loading when saving the list fails` — исправления по ревьюеру

### Артефакты
- [`docs/ai/sessions/05-data.md`](sessions/05-data.md), [`docs/ai/prompts/05-data.md`](prompts/05-data.md)
- Ручной запуск на устройствах и скриншоты — не выполнялись на этом этапе (заглушки UI готовы для ручной проверки).

### Пауза перед этапом 6

После отчёта по этапу 5 автор попросил: три правки стиля кода отдельными коммитами, раздел Code style в `CLAUDE.md` и анализ перед UI без изменений кода.

#### 1. Правки стиля кода

| Коммит | Что сделано |
|--------|-------------|
| `60a8467 refactor: kebab-case file names` | 22 файла переименованы через `git mv`, импорты исправлены. Компоненты по-прежнему экспортируются в PascalCase (`posts-screen.tsx` → `PostsScreen`). Имена тест-файлов в `architecture.md` обновлены |
| `fed627a refactor: remove redundant comments` | Убраны комментарии, пересказывающие код, шапки файлов и пометки «заглушка» (они есть в журнале). Оставлены и переписаны комментарии, которые объясняют «почему»: ссылки на инварианты, неочевидные решения, обходы особенностей библиотек (generic-тип трекера, селектор Zustand 5) |
| `89df57c style: padding lines between statements` | Правило отступов между блоками, затем `eslint --fix` по всему коду |
| `a9d1186 docs: code style rules` | Раздел Code style в `CLAUDE.md`: только то, что не проверяет линтер, и ссылка на автоматические проверки. Новые dev-зависимости добавлены в Stack |

**Lint-правила:**
- `check-file/filename-naming-convention`: kebab-case для `**/*.{js,jsx,ts,tsx}`. С `ignoreMiddleExtensions` проверяется только часть имени до первой точки, поэтому `load-posts.test.ts` проходит. Исключения не понадобились: корневой `index.js` и конфиги уже в kebab-case;
- `check-file/folder-naming-convention`: kebab-case для `src/**/`;
- `@stylistic/padding-line-between-statements`:
  - пустая строка перед `return`;
  - после объявлений;
  - между выражением и объявлением;
  - до и после многострочных `const`/`let`/выражений;
  - без пустых строк между подряд идущими однострочными `const`/`let`.

  Проверено на эталоне автора (`use-toggle-favorite.ts` совпал). Core-правило `padding-line-between-statements` не используется: оно устарело в ESLint 8.53.

**Dev-зависимости** (одобрены автором): `eslint-plugin-check-file` 2.8.0, `@stylistic/eslint-plugin` 3.1.0.

**Почему не последние версии.** Проверено в npm 2026-10-08: последние версии требуют ESLint 9 (`check-file` 3.x — peer `eslint >=9.0.0`, `@stylistic` 4.x и новее — тоже). В проекте ESLint 8.57.1 из шаблона RN. Поэтому взяты последние версии с поддержкой ESLint 8: `check-file` 2.8.0 (peer `eslint >=7.28.0`) и `@stylistic` 3.1.0 (peer `eslint >=8.40.0`). Обе работают с `.eslintrc.js`.

**Нюансы:**
- **История `app.tsx`.** При `App.tsx → app.tsx` поменялись две строки импорта из 10, сходство 47% при пороге git по умолчанию 50%. Поэтому `git log --follow src/app/app.tsx` историю до переименования не показывает, а `git log --follow -M40% src/app/app.tsx` показывает. Остальные 21 файл распознаются как переименования (сходство 86–100%).
- **`metro.config.js`** (файл шаблона). Правило «без пустых строк между однострочными `const`» убрало пустую строку между `require` и JSDoc-комментарием перед следующим `const`. Исключения для комментариев у правила нет.

#### 2. Комментарии: где ИИ ошибся — что поправил автор

- **Было.** Агент писал комментарии почти в каждом файле: шапки модулей, пересказ кода («Favorites first…», «GET a JSON resource…»), пометки о заглушках.
- **Вопрос автора.** Это требование `architecture.md` или решение агента?
- **Ответ агента.** `architecture.md` комментариев не требовал, это было решение агента.
- **Стало.** Комментарий только когда он объясняет «почему»: неочевидное решение, ссылка на инвариант или обход бага. Пересказ кода и шапки файлов убраны (`fed627a`), правило записано в `CLAUDE.md` (Code style).

#### 3. Анализ перед UI

**Что проверено** (в установленных пакетах и нативных проектах, 2026-10-08):
- peer-зависимости `@react-navigation/native-stack` 7.20.0: `react-native-gesture-handler` среди них нет;
- `android/gradle.properties`: `edgeToEdgeEnabled=true`; `android/build.gradle`: targetSdk 36;
- `ios/LoremFeed/Info.plist`: `UIViewControllerBasedStatusBarAppearance = false`;
- обработка hardware back в `@react-navigation/native` (`useBackButton`);
- `AndroidManifest.xml`: `android:allowBackup="false"`.

| # | Пункт | Вердикт агента | Решение автора |
|---|-------|----------------|----------------|
| 1 | `SafeAreaProvider` | уже есть; нужны отступы `insets.bottom` (Android edge-to-edge) | берём |
| 2 | `GestureHandlerRootView` | не нужен: native-stack его не требует, жесты назад нативные | не берём |
| 3 | `StatusBar` по теме | нужен: при edge-to-edge строка состояния прозрачная. Опция `statusBarStyle` native-stack на iOS не работает из-за `Info.plist`, поэтому `StatusBar` из RN core | берём |
| 4 | ErrorBoundary в `app` | опционально: в release ошибка рендера закрывает приложение | берём: fallback с сообщением и «Try again», которая перерисовывает дерево; сброса данных нет (инвариант 5) |
| 5 | мемоизация строк | опционально, дёшево: `React.memo`, примитивные пропсы, стабильный `renderItem` | берём |
| 6 | `getItemLayout` | не нужен: высота строки зависит от системного размера шрифта | не берём |
| 7 | `keyExtractor` | уже сделан (`String(post.id)`) | — |
| 8 | accessibility | нужен: роли и подписи у строк и кнопки; звезда скрыта от скринридера; картинка 300×300 декоративная | берём |
| 9 | Android back | не нужен код: native-stack обрабатывает сам | автор проверит вручную на этапе 6 |
| 10 | тема в `NavigationContainer` | нужна, уже в плане (1.3, R-14) | берём |
| 11 | `ScrollView` на деталях | нужен: длинный `body` иначе обрезается | берём |
| 12 | заголовки экранов | решение за автором | «Posts» у списка, фиксированный «Post» у деталей |
| 13 | запись persist при `setListStatus` | не стоит затрат: объём — десятки КБ, несколько раз за сессию | не берём |
| 14 | `android:allowBackup` | уже `false`, иначе Auto Backup восстановил бы MMKV после переустановки | — |

Ни один принятый пункт не добавляет зависимостей.

**FlatList, а не FlashList** (решение автора, ADR-6): при 100 простых строках выигрыша нет, лишняя нативная зависимость не оправдана. Если список вырастет, FlashList — первый кандидат на замену.

**Где записано.** Решения — в R-14 (`requirements.md`), задачи по модулям — в `architecture.md`, раздел 9, и ADR-6. Автор просил записать в `architecture.md`. Решения агент сначала записал в `requirements.md`, потому что так требует вводная `architecture.md`: «новых решений здесь нет, решения автора сначала записаны в `requirements.md`». Агент сообщил об этом автору.

#### 4. `project.pbxproj` и `DEVELOPMENT_TEAM`

После `yarn add` (postinstall → `pod install`) в рабочем дереве появилось изменение `DEVELOPMENT_TEAM` в `ios/LoremFeed.xcodeproj/project.pbxproj`. Это локальная настройка подписи автора. Агент файл не коммитил и не трогал, автору об этом сообщил.

По решению автора правило записано в `CLAUDE.md` (Process): `DEVELOPMENT_TEAM` в `project.pbxproj` никогда не коммитится. Файлы индексируются явно, это изменение не попадает в индекс. Если понадобятся другие правки этого файла — сначала спросить.

#### 5. Ручная проверка этапа 5

Не проводилась (на момент записи). Агент запуск на iOS и Android не выполнял. Результатов ручной проверки от автора в сессии нет. Сценарий проверки из плана этапа 5:
- заголовки загружаются;
- избранное переключается на экране деталей;
- список пересортировывается;
- после перезапуска запроса в сеть нет, избранное сохранено.

Этот сценарий ещё не пройден ни на одной платформе.

## Этап 6. UI — 2026-10-08

План этапа утверждён автором: четыре подшага с отдельными коммитами, без новых зависимостей.

### 6.1 Тема и shared/ui
- `shared/theme`: палитры `lightColors` / `darkColors` с одинаковыми ключами, токены `spacing`, `radius`, `typography`, хук `useTheme` на `useColorScheme`. Значения цветов выбрал агент (дизайн произвольный, T-8).
- `shared/ui`: `StarIcon` (★/☆, скрыт от скринридера), `RemoteImage` (фон `surface` как плейсхолдер; у картинок от 64 px — спиннер при загрузке и текст «Image unavailable» при ошибке; у 32×32 — только пустой фон, текст не помещается), `Button`, `StateView`.
- Отклонение от плана: у `StateView` пропсы `actionTitle` / `onAction` вместо `onRetry`, чтобы ErrorBoundary переиспользовал его с «Try again». По умолчанию `actionTitle = 'Retry'`.
- Тема навигации собирается в `app/providers/navigation-theme.ts` из `DefaultTheme` / `DarkTheme` и палитры, чтобы `shared/theme` не зависел от React Navigation.
- `StatusBar` из RN core по `isDark`; gate получил фон темы.

### 6.2 PostsScreen
- `entities/post/ui/PostCard`: `React.memo` с примитивными пропсами; аватар 32×32, `title` в 1 строку, `body` в 2 строки; у избранного — фон `favoriteBackground` и ★ справа. Подпись для скринридера — заголовок, у избранного с «, favorite».
- `PostsList`: состояния через `StateView` — спиннер, «Something went wrong» + Retry, «No posts» + Retry (текст ошибки выбрал агент). Стабильные `renderItem` (`useCallback`) и `keyExtractor` (уровень модуля), нижний отступ `insets.bottom`.
- В public API `entities/post` добавлены `PostCard` и `IMAGE_SIZE` (нужен DetailsScreen для картинки 300×300).
- Позиция скролла: native-stack держит PostsScreen смонтированным под деталями, кода не нужно; проверяется вручную.

### 6.3 DetailsScreen
- `ScrollView` с фоном темы и нижним отступом `insets.bottom + spacing.xl`; картинка 300×300 по центру (декоративная, скрыта от скринридера), `title`, `body`, под текстом кнопка избранного.
- Пост не найден (путь недостижим: детали открываются только из списка) — `StateView` «Post not found» вместо прежнего `Post ${postId}`. Решение агента.
- `ToggleFavoriteButton`: `Animated.View` со scale 1 → 0.95 на `onPressIn` (`timing`, 80 мс) и `spring` обратно на `onPressOut`, `useNativeDriver`. Неизбранное — контурная кнопка «☆ Add to favorites», избранное — залитая «★ In favorites». `accessibilityRole="button"`, `accessibilityState={{ selected }}`.

### 6.4 ErrorBoundary, заголовки, доводка
- `app/error-boundary`: классовый компонент, fallback через `StateView` — «Something went wrong» + «Try again». Кнопка только сбрасывает состояние границы и перерисовывает дерево, сторы не трогает (инвариант 5). В dev ошибка логируется.
- Порядок в `AppProviders`: `SafeAreaProvider > StatusBar + ErrorBoundary > HydrationGate > NavigationContainer`. Gate по-прежнему оборачивает навигацию (инвариант 4). После «Try again» навигация пересоздаётся и открывается список — это приемлемо.
- Заголовки: «Posts» и «Post» (`options.title` в `root-stack`).
- `docs/architecture.md`: в дереве 1.2 появились `error-boundary` и `navigation-theme`, в таблице 1.3 — импорты `shared/theme` и `IMAGE_SIZE` в public API `entities/post`.
- Ревьюер: блокирующих нарушений нет. Три мелких замечания по документации (нет записи 6.4 в журнале, таблица 1.3 отстала от кода) исправлены в этом подшаге.

### 6.5 Правки автора после 6.4: звезда в шапке, стиль DetailsScreen
**Изменено решение Q8 (R-7), автор.** Было: кнопка с текстом «Add to favorites» / «In favorites» под текстом поста. Стало: звезда в шапке справа (`headerRight`), её ставит `pages/details` через `navigation.setOptions`, сама кнопка живёт в `features/toggle-favorite`. Причина автора: в мобильных приложениях действие «в избранное» живёт в шапке, кнопка в потоке контента читается как отправка формы. Обновлены R-1, R-7, I-11, пример строк в R-14, `architecture.md` (1.2, 1.3, 4.4).
- Динамика: ☆ → ★, цвет `colors.text` → `colors.star`, scale-анимация на `Animated` (сжатие до 0.6 и `spring` обратно при нажатии). Подпись для скринридера «Add to favorites» / «Remove from favorites», `accessibilityState={{ selected }}`, `hitSlop` 12.
- **Не подтверждено автором:** «акцентный цвет» понят как цвет звезды из темы (`colors.star`, золотой), а не `primary`. Неактивная звезда — цвет текста шапки.
- `headerRight` мемоизирован (`useCallback` по `postId`) и ставится в `useLayoutEffect`, чтобы звезда появилась без мигания.

**Стиль DetailsScreen.** Над заголовком строка «Post #{id}» (`caption`, `textSecondary`). Заголовок — `heading` 22/28, вес изменён с 700 на 600 (semibold). Текст — новый токен `typography.article` 16/26, цвет `textSecondary`. Картинка 300×300 pt без растягивания, скругление `radius.lg` и мягкая тень на обёртке: `Image` обрезает себя по скруглению и тень не отрисует. На Android у обёртки фон `surface`, без фона `elevation` не даёт тени. Отступы — токены `spacing`.

**Ручная проверка iOS (iPhone 17 Pro, iOS 26.3).** Список и детали в светлой и тёмной теме — скриншоты в `docs/screenshots/`. В iOS 26 native-stack рисует кнопки шапки в «стеклянной» подложке, звезда встаёт в неё корректно. Первая попытка снять детали дала снимок списка: экран уже был закрыт на момент снимка; повторили, сверившись с экраном перед сменой темы.

### 6.6 Правки автора: стиль PostsScreen
Решения Q6 и Q10 не меняются: в списке избранное только отображается. Изменён только вид (R-1, R-6 обновлены).
- Шапка: на iOS большой заголовок, сжимается при скролле; у `FlatList` `contentInsetAdjustmentBehavior="automatic"`. Опция `headerLargeTitle` из задания в native-stack 7.20 помечена `@deprecated`, использована её замена `headerLargeTitleEnabled`. Опция работает только на iOS, поэтому проверка платформы не нужна: на Android обычный заголовок.
- Выделение избранного: токен `favoriteTint` вместо бежевого `favoriteBackground`. Это цвет звезды (`colors.star`) с прозрачностью 8% — свой для светлой и тёмной темы. Звезда по центру строки по вертикали. **Не подтверждено автором:** «акцентный» снова понят как цвет звезды, а не `primary`, как и в 6.5.
- Аватар круглый (`radius = THUMBNAIL_SIZE / 2`).
- Разделитель — нижняя граница у правой части строки (текст и звезда), поэтому начинается от текста. Отдельный `ItemSeparatorComponent` в виджете не понадобился, и отступ не надо выносить из `entities/post`.
- Отклик на нажатие: на iOS фон `colors.pressed`, на Android `android_ripple` того же цвета. Токен `pressed` добавлен в палитру.
- Типографика: заголовок `title` 17/600 в 1 строку, превью `body` 15 цветом `textSecondary` в 2 строки (было `caption` 13).
- README: появился раздел «Решения» с первым пунктом — почему в списке нет переключателя избранного (текст автора). Остальной README — этап 7.
- Скриншоты: при смене темы через `simctl ui appearance` приложение теряло соединение с Metro (Fast Refresh disconnected, всплывающее предупреждение в dev). Похоже на артефакт dev-окружения: обрывы соединения в системном логе совпадают по времени со сменой темы. Текст предупреждения агент не видел, release-сборку не проверял. Скриншот светлой темы переснят после перезапуска без всплывающих сообщений.

### 6.7 Проверка форматирования
Полный прогон ревьюера после 6.6 нашёл неотформатированный код: `post-card.tsx` (после правки агента), `navigation-theme.ts` и `state-view.tsx` (уже в коммите 6.1). Lint этого не ловил: правила `prettier/prettier` нет, `@react-native` подключает только `eslint-config-prettier`, который отключает конфликтующие правила. Утверждение в `CLAUDE.md` «Prettier formatting enforced by `yarn lint`» было неверным. Почему агент не заметил: правки шли через shell (heredoc), хук `post-edit-check.sh` срабатывает только на Edit/Write и Prettier тоже не запускает.

Решение автора: без новой зависимости (`eslint-plugin-prettier` не берём). Добавлен скрипт `format:check` (`prettier --check .`), шаг в CI и пункт в DoD (`CLAUDE.md`). `yarn format` прогнан по всему проекту: изменились только `navigation-theme.ts` и `state-view.tsx`, `post-card.tsx` отформатирован ещё перед коммитом 6.6. Markdown исключён в `.prettierignore` — документация форматируется вручную. Обновлены `CLAUDE.md` (Code style, Commands, DoD) и R-13.

### 6.8 Где лежат скриншоты (R-12)
Ревьюер отметил, что скриншоты этапа 6 лежат в `docs/screenshots/`, а R-12 называл только `docs/ai/screenshots/`. Решение автора: `docs/screenshots/` — скриншоты приложения для README, `docs/ai/screenshots/` — скриншоты чатов с ИИ. R-12 уточнён, файлы не переносились. Скриншоты этапа 4 (`04-scaffold-*.png`) — тоже снимки приложения, но они остаются в `docs/ai/screenshots/` как проверка этапа каркаса. Это трактовка агента, автор её не подтвердил; в R-12 она записана.

### 6.9 Акцентный цвет
В 6.5 и 6.6 агент понял «акцентный цвет» как цвет звезды `colors.star`, а не `primary`, и отметил это как неподтверждённое. Автор одобрил визуальный результат и попросил зафиксировать реализацию без изменения кода. Записано в R-14 (новый пункт «Акцентный цвет избранного»), ссылки из R-6 и R-7, `architecture.md` (таблица 1.3: `shared/theme`, `features/toggle-favorite`).

### 6.10 `architecture.md` приведён к коду
По замечаниям ревьюера:
- в дереве 1.2 `App.tsx` → `app.tsx` (файлы в kebab-case с этапа 5);
- в таблице 1.3 у `app` добавлены импорты `shared/lib/storage` (тип `HydrationTracker`) и `shared/ui` (`StateView` в ErrorBoundary);
- в public API `shared/lib/storage` добавлен тип `HydrationTracker`, в public API `shared/theme` — `Theme`, `lightColors`, `darkColors`, `Colors` и токены;
- в 4.2 `useLoadPosts` возвращает `{ status, isListLoaded, retry }`;
- в 6.1 добавлен `routes.test.ts`.

Код не менялся.

### 6.11 Ручная проверка Android
Проверил автор вручную на Android-эмуляторе после правок 6.6 (позже код менялся только форматированием в 6.7). Со слов автора, всё в порядке:
- оба экрана (темы автор отдельно не называл);
- отклик на нажатие строки (`android_ripple`);
- тень под картинкой 300×300 (`elevation`);
- звезда в шапке DetailsScreen;
- кнопка Back (какие сценарии проверены, автор не уточнял) — закрывает пункт 9 раздела 9 `architecture.md`;
- данные сохраняются после перезапуска (D-3, D-4);
- работа без сети после первой загрузки (I-2);
- позиция скролла после возврата с деталей (R-14).

Агент эту проверку не проводил, результат записан со слов автора.

### 6.12 Скриншоты Android
`docs/screenshots/android-{posts,details}-{light,dark}.png`, эмулятор 1080×2340, тема переключалась через `adb shell cmd uimode night yes|no`. Пост #1 добавлен в избранное по согласию автора: агент нажал звезду в шапке через `adb shell input tap` и вернулся к списку через `adb shell input keyevent 4`. Без этого на списке не было бы выделения избранного, как на iOS. Первый снимок попал на загрузку бандла из Metro («Downloading 0.0%»), поэтому агент проверял каждый кадр перед сохранением. Эмулятор возвращён в тёмную тему.

### Итог этапа 6

**Замечания ревьюера и как закрыты.** Ревьюер запускался дважды.
- После 6.4 (дифф этапа): три мелких замечания по документации — нет записи 6.4 в журнале, в таблице 1.3 не хватало импортов `shared/theme` и `IMAGE_SIZE`. Исправлено в коммите 6.4.
- После 6.6 (полная проверка по `requirements.md`): девять мелких замечаний, блокирующих нет.
  - Prettier не проверялся, `CLAUDE.md` утверждал обратное — `format:check` в CI и DoD (6.7).
  - Скриншоты лежали не там, где называл R-12 — R-12 уточнён: `docs/screenshots/` для приложения, `docs/ai/screenshots/` для чатов (6.8).
  - Android не проверен вручную — проверил автор (6.11).
  - Пять расхождений `architecture.md` с кодом — исправлены (6.10).
  - Отдельно ревьюер отметил открытый вопрос об акцентном цвете — закрыт решением автора (6.9).

**Ручная проверка.**
- iOS (симулятор iPhone 17 Pro, iOS 26.3), проверял агент по скриншотам: список и детали в светлой и тёмной теме, после 6.5 — звезда в шапке (пустая и залитая), после 6.6 — большой заголовок, оттенок избранного, круглые аватары, разделители от текста. Нажатия делал автор (открытие поста, избранное). Агент на iOS **не проверял**: подсветку строки при нажатии, анимацию звезды, позицию скролла, кнопку назад, состояния error/empty, fallback ErrorBoundary, сохранение после перезапуска, работу без сети.
- Android: проверил автор (6.11). Агент только снимал скриншоты (6.12).

**Скриншоты** (`docs/screenshots/`, все восемь сняты):
- `ios-posts-{light,dark}.png` — сняты после 6.4, пересняты после 6.6;
- `ios-details-{light,dark}.png` — сняты после 6.5 (пост #2 в избранном);
- `android-posts-{light,dark}.png`, `android-details-{light,dark}.png` — сняты после 6.11 (пост #1 в избранном).

**Где агент ошибся и что поправил автор.**
- Отступы в `post-card.tsx` сбиты при правке через shell, плюс два неотформатированных файла в 6.1. Агент считал, что Prettier проверяет lint, — так было написано в `CLAUDE.md`, агент не проверил. Нашёл ревьюер, способ исправления выбрал автор: `format:check` без новой зависимости (6.7).
- Первая попытка снять детали на iOS дала снимок списка: агент не посмотрел на экран перед снимком. Файлы удалены, автор открыл пост повторно.
- Скриншот списка в светлой теме на iOS сначала сохранён с dev-оверлеями (Fast Refresh, предупреждение). Агент заметил сам и переснял.
- В журнал 6.6 агент сначала записал непроверенное «в release этого нет». Поправил сам до коммита.
- В 6.11 агент дописал детали, которых автор не сообщал (темы, сценарии Back). Исправлено при сверке журнала.
- После 6.4 агент не записал подшаг в журнал до прогона ревьюера, а таблица 1.3 отстала от кода. Нашёл ревьюер.
- Дизайн-правки 6.5 и 6.6 (звезда в шапке, стиль экранов) — не исправление ошибок, а решения автора после скриншотов. Исходная кнопка под текстом соответствовала тогдашнему R-7.

## Этап 7. Финал — 2026-10-08

Глубину проверки чистого клона и подпись APK автор выбрал до начала работы, в ответах на вопросы агента. План этапа утверждён автором.

### Финальное ревью
Полный прогон ревьюера по T/F/D/S/I/R, инвариантам и FSD. Документы этапа 7 в этот момент ещё писались, поэтому зависящие от них пункты (S-1, S-2, README для R-4 и I-9, `AI_WORKFLOW.md`) ревьюер отметил как ожидающие, а не как нарушения. **Блокирующих нарушений нет.**

**Пункт задания → где реализован → чем проверен.** Таблицу составил ревьюер. Тесты и lint-правила он указывал, только если нашёл их в репозитории. Пути — от `src/`, если не указано иное.

| Пункт | Где реализован | Чем проверен |
|-------|----------------|--------------|
| T-1 RN ≥ 0.77, bare, не Expo | `package.json`, `android/gradle.properties`, `ios/LoremFeed/Info.plist` (New Architecture) | ревьюер: нет `expo*`; сборки — этап 4 и чистый клон этапа 7 |
| T-2 TypeScript | `tsconfig.json` (`strict`) | `yarn typecheck` в CI |
| T-3 React Navigation ≥ 7 | `app/navigation/root-stack.tsx`, `shared/config/navigation` | `routes.test.ts`, typecheck, ручная проверка 6.11 |
| T-4 FakerJS | `entities/post/lib/enrich.ts` | `enrich.test.ts`; lint `no-restricted-imports` |
| T-5 State-manager | `entities/post/model/store.ts`, `entities/favorite/model/store.ts` | `create-hydration-tracker.test.ts` (настоящий `persist`) |
| T-6 Чистая архитектура | FSD-структура `src/` | lint `boundaries/dependencies`; ревьюер |
| T-7 iOS и Android | `ios/`, `android/` | этап 4 «Сборка на платформах»; 6.5, 6.6 (iOS); 6.11 (Android); чистый клон этапа 7 |
| T-8 Дизайн произвольный | `shared/theme`, `entities/post/ui/post-card.tsx`, `pages/details/ui/details-screen.tsx` | ручная проверка 6.5, 6.6; скриншоты 6.12 |
| F-1 Список из `/posts` | `shared/api/fetch-json.ts`, `entities/post/api/posts.ts`, `features/load-posts` | `load-posts.test.ts`, `validate.test.ts`; ручная проверка 6.11 |
| F-2 Картинка 32×32 | `enrich.ts`, `entities/post/config/image-sizes.ts`, `post-card.tsx` | `enrich.test.ts`; ручная проверка 6.6, 6.11 |
| F-3 Выделение избранного | `post-card.tsx`, токен `favoriteTint` в `shared/theme/palette.ts` | `sort-posts.test.ts` (флаг `isFavorite`); ручная проверка 6.6, 6.12 |
| F-4 Избранные вверху | `widgets/posts-list/model/sort-posts.ts`, `use-sorted-posts.ts` | `sort-posts.test.ts` |
| F-5 Нажатие открывает детали | `pages/posts/ui/posts-screen.tsx`, `root-stack.tsx` | ручная проверка: этап 4 (Android), 6.5 (iOS), 6.11 |
| F-6 Пост из `/posts/{id}` | `entities/post/api/posts.ts`, `features/load-post-details`, `entities/post/model/save.ts` | `load-post-details.test.ts`, `validate.test.ts` |
| F-7 Картинка 300×300 | `build-image-url.ts`, `enrich.ts`, `use-post-view.ts`, `shared/ui/remote-image.tsx` | `enrich.test.ts` (`toPostDetails`); ручная проверка 6.5 |
| F-8 Кнопка-переключатель | `features/toggle-favorite`, `entities/favorite/model/store.ts` | юнит-теста нет (компонентные тесты не пишем, R-13); ручная проверка 6.5, 6.11, 6.12 |
| D-1 Список один раз | `features/load-posts/model/load-posts.ts`, `isListLoaded` в `entities/post/model/store.ts` | `load-posts.test.ts`; lint `no-restricted-syntax` |
| D-2 Картинки один раз | `enrich.ts` (единственный вызов faker), `save.ts`, public API `entities/post` без `enrichPosts` | `enrich.test.ts`, `load-posts.test.ts`; lint `no-restricted-imports` и `boundaries/dependencies`; ревьюер: `savePostList` вызывается только в `features/load-posts` |
| D-3 Повторный запуск из хранилища | `shared/lib/storage/mmkv.ts`, persist, gate `app/hydration` | `create-hydration-tracker.test.ts`, `hydration-gate.test.ts`, `load-posts.test.ts`; ручная проверка 6.11 (только Android) |
| D-4 Избранное сохраняется | `entities/favorite/model/store.ts`, gate `app/hydration` | те же тесты; ручная проверка 6.11 (только Android) |
| S-1 GitHub + README | `README.md` | этап 7 |
| S-2 Установка и запуск | `package.json`, `scripts/postinstall.js`, `.yarnrc.yml`, `Gemfile` | чистый клон этапов 4 и 7; CI `yarn install --immutable` |
| S-3 AI-only | `docs/ai/`, `CLAUDE.md`, `.claude/` | ревьюер |
| S-4 Чаты, скриншоты | `docs/ai/sessions/01…06`, `docs/ai/screenshots/` | ревьюер; сессия этапа 7 ещё не выгружена |
| S-5 Промпты и правила | `docs/ai/prompts/01…06`, `CLAUDE.md`, `.claude/` | ревьюер; промпты этапа 7 ещё не извлечены |
| I-1 Состояния только у PostsScreen | `widgets/posts-list/ui/posts-list.tsx`; `load-post-details.ts` (лог в dev) | `load-posts.test.ts`, `load-post-details.test.ts`; UI error / empty руками не проверялся |
| I-2 Работа без сети | persist + MMKV, fallback в `remote-image.tsx` | ручная проверка 6.11 (только Android) |
| I-3, I-4 Seed один раз, URL с `/seed/` | `enrich.ts`, `build-image-url.ts`, `use-post-view.ts` | `enrich.test.ts`; проверка picsum на этапе 1 |
| I-5 Избранное сразу видно в списке | `use-sorted-posts.ts` (подписка на оба стора) | ручная проверка 6.5, 6.12 |
| I-6 Стабильная сортировка | `sort-posts.ts` | `sort-posts.test.ts` |
| I-7 FlatList, ключ `id`, детали по открытию | `posts-list.tsx`, `details-screen.tsx` | ревьюер (структурная гарантия) |
| I-8 Api без UI, хранилище заменяемо | `fetch-json.ts` (возвращает `unknown`), `create-hydration-tracker.ts` (хранилище аргументом) | `create-hydration-tracker.test.ts` (хранилище в памяти); lint `boundaries/dependencies` |
| I-9 Сборка по README | `ios/`, `android/`, `scripts/postinstall.js` | чистый клон этапа 7 (ниже) |
| I-10 Версии зафиксированы | `.nvmrc`, `engines`, `packageManager`, `yarn.lock` | CI: `node-version-file`, `yarn install --immutable` |
| I-11 Кнопка отражает состояние | `toggle-favorite-button.tsx`, `shared/ui/star-icon.tsx` | ручная проверка 6.5 и итог этапа 6 |
| I-12 Кнопка работает всегда | `toggle-favorite-button.tsx` не зависит от `load-post-details` | ревьюер (структурная гарантия) |

**Замечания ревьюера** (оба minor):

| # | Замечание | Как закрыто |
|---|-----------|-------------|
| 1 | ADR-3 в `architecture.md` говорил «выбор точки импорта faker — на этапе 5», хотя выбор уже сделан | записан итог: `@faker-js/faker/locale/base`, бандл 1,4 МБ (по журналу этапа 5) |
| 2 | экраны error / empty и fallback ErrorBoundary не проверялись руками ни на одной платформе; на iOS, кроме того, не проверялись сохранение после перезапуска, работа без сети, Back и позиция скролла (итог этапа 6) | **не закрыто.** Вынесено автору как открытый пункт. Логику error / empty покрывают юнит-тесты `load-posts.test.ts`, UI — нет |

Повторного прогона ревьюера по готовым документам этапа 7 не было.

### Документы
- **[`README.md`](../../README.md)** на русском: описание, восемь скриншотов (iOS и Android, светлая и тёмная тема), быстрый старт со ссылкой на официальный гайд RN (одна команда на установку, вторая на запуск), раздел APK, стек и архитектура со ссылкой на `architecture.md`, допущения из раздела 6 `requirements.md` и сознательные решения (нет pull-to-refresh, избранное только в деталях, FlatList вместо FlashList, сброс данных), таблица «инвариант → способ проверки», раздел про AI-подход: spec-driven development и ссылка на `docs/ai/`. Абзац автора о переключении избранного только в деталях сохранён без изменений.
- **[`AI_WORKFLOW.md`](AI_WORKFLOW.md)**:
  - этап 0 одним абзацем: подход, ключевые решения и черновики промптов готовились в отдельном чате с Claude (claude.ai), исполнение — в Claude Code. Выгрузка этого чата не прикладывается, потому что все решения из него зафиксированы в `requirements.md`, `architecture.md` и журнале. Формулировку и причину дал автор в задаче этапа;
  - процесс по этапам 1–7 с ролями автора и агента;
  - инструменты: `CLAUDE.md`, скилл, ревьюер, хук, lint-правила, `format:check` и CI;
  - семь эпизодов «где ИИ ошибся — как поймано» и одна ошибка самого ревьюера (этап 2). Всё взято из этого журнала.
- **[`docs/ai/README.md`](README.md)** — индекс «этап → сессия → промпты → прочее». Этап 0 — без выгрузки, этап 7 отмечен как ожидающий экспорта.
- В журнале исправлены ссылки на артефакты этапов 3–5. Экспорты сессий уже лежат в `docs/ai/sessions/`. Файлы этапа 5 называются `05-data.md`, а не `05-data-state.md`.

### Аудит комментариев
На этапе 7 не проводился. Последний аудит был перед этапом 6 (коммит `fed627a`, раздел «Пауза перед этапом 6»). После этого правило «комментарий объясняет только почему» действует через `CLAUDE.md` (Code style). На этапе 6 код ревьюер проверял, но отдельного аудита комментариев не было. На этапе 7 код в `src/` не менялся.

### Чистый клон
`git clone` локального репозитория в scratchpad. HEAD — `4d4c423`. Документы этапа 7 ещё не закоммичены, на сборку они не влияют. Код в `src/` у клона и основного репозитория одинаковый.

| Шаг | Результат |
|-----|-----------|
| 1. `yarn install` | 28 с, Yarn 4.18.1 из `packageManager`. Вывод `postinstall` Yarn не показывает, поэтому результат проверен по файлам: `ios/Pods` создан, `Pods/Manifest.lock` совпадает с `Podfile.lock`, рабочее дерево клона чистое. Предупреждения те же, что на этапе 4: peer-зависимости внутри пакетов `@react-native/*`, скрипты `unrs-resolver` |
| 2. `yarn typecheck`, `lint`, `format:check`, `test` | зелёные: 8 наборов, 44 теста |
| 3. `cd android && ./gradlew assembleRelease` | `BUILD SUCCESSFUL in 6m 1s`. Установлен на эмулятор Pixel_8_Pro (API 37) через `adb install -r` поверх debug-сборки: ключ тот же, данные сохранились. Открывается на списке, dev-оверлеев нет |
| 4. `yarn ios` на iPhone 17 Pro | сборка и запуск успешны (1 мин 41 с), приложение открылось на списке. Нюанс — ниже |

**Нюанс шага 4.** Metro основного репозитория уже слушал порт 8081. Для клона Metro запущен на 8082: `yarn start --port 8082`, затем `yarn ios --port 8082 --no-packager`. Приложение всё равно подключилось к 8081, это показал `lsof`. Тогда агент перенаправил его на Metro клона через `RCT_jsLocation` в defaults симулятора. После перезапуска JS загрузился с 8082, и приложение открылось на списке. Потом `RCT_jsLocation` удалён, Metro клона остановлен. Нативная сборка шла из клона в обоих случаях.

**Что падало:** ничего. Исправлять было нечего, коммитов с исправлениями нет.

На симуляторе и эмуляторе остались данные прежних запусков. Поэтому шаги 3 и 4 проверили сборку и запуск, а не первую загрузку.

### APK
- Подписан debug-ключом из шаблона RN: в `android/app/build.gradle` у `release` стоит `signingConfig signingConfigs.debug`.
- Файл `app-release.apk` собран из чистого клона (`android/app/build/outputs/apk/release/`). Размер 71 360 553 байта (~71 МБ, четыре ABI в одном APK), SHA-256 `7e3d8f3bb90381436f8d289bd38daa4dce9b7b5567ad9b2bb84a72e8f24801d7`. В репозиторий не добавлен, опубликован в релизе `v1.0.0` (ниже).
- **Почему свой keystore не заводили** (решение автора): для тестового задания debug-подписи достаточно, а со своим ключом в репозитории или CI появились бы секреты. В README рядом со ссылкой на APK одна строка: сборка для проверки, не для публикации; при установке может понадобиться разрешить установку из неизвестных источников.

### Релиз на GitHub и ссылки в README
- Релиз `v1.0.0` создал автор: [страница релиза](https://github.com/beliykirill/lorem-feed/releases/tag/v1.0.0), ассет `app-release.apk`.
- В сообщении автора вместо прямой ссылки на APK стоял шаблон `<прямая ссылка>`. Агент взял ссылку из GitHub API (`/releases/tags/v1.0.0`, поле `browser_download_url`): [app-release.apk](https://github.com/beliykirill/lorem-feed/releases/download/v1.0.0/app-release.apk). Размер ассета совпадает с APK из чистого клона — 71 360 553 байта. Контрольную сумму скачанного ассета агент не сверял.
- В README вместо TODO вставлены прямая ссылка на скачивание и ссылка на страницу релиза: коммит `cea42b9 docs: add APK release link`. В этот коммит вошёл весь README этапа 7, до этого он не коммитился.
- Тег `v1.0.0` стоит на `4d4c423` — коммите до правки README. Это ожидаемо: тот же коммит был HEAD чистого клона, из которого собран APK, а ссылку на релиз можно вставить только после его создания.

### Где агент ошибся и что поправил автор
Все ошибки агент нашёл сам, до отчёта автору.

| Ошибка агента | Как найдена | Исправление |
|---------------|-------------|-------------|
| в README написано «JDK 17+», хотя в источниках проекта этого нет (в журнале этапа 4 — JDK 21) | агент, при перечитывании до отчёта | «Android SDK и JDK по гайду» |
| агент считал, что `yarn ios --port 8082` подключит приложение к Metro клона. На деле оно подключилось к Metro основного репозитория на 8081 | агент, проверка соединений через `lsof` | перенаправление через `RCT_jsLocation`, повторный запуск, затем откат настройки |
| в итоге процесса было «20 вопросов к автору на этапе требований», хотя Q19 и Q20 появились на этапе архитектуры | агент, при сверке с журналом | формулировка исправлена |
| ревьюер запущен параллельно с написанием документов, поэтому README и `AI_WORKFLOW.md` он не видел. Повторного прогона нет | агент, по отчёту ревьюера | не исправлено, вынесено автору |

Ошибок агента автор на этом этапе не поправлял. Решения автора на этапе — подпись APK и глубина проверки чистого клона — это ответы на вопросы агента, а не правки.

### Открытые пункты
- Ручная проверка экранов error / empty и fallback ErrorBoundary, а на iOS ещё сохранения после перезапуска, работы без сети, Back и позиции скролла (замечание 2 ревьюера).
- Повторный прогон ревьюера по документам этапа 7.
- Экспорт сессии этапа 7 и извлечение промптов.

### Итог всего процесса
- Семь этапов, после каждого — остановка до подтверждения автора. До первой строки кода прошли три этапа: требования (вопросы Q1–Q18, Q19 и Q20 появились на этапе архитектуры; все закрыты решениями R-1…R-14), AI-окружение и архитектура.
- По журналу ревьюер запускался 15 раз: этап 2 — 2, этап 3 — 6, этап 4 — 3, этап 5 — 1, этап 6 — 2, этап 7 — 1. Самые серьёзные находки — на этапе архитектуры, до кода: фабрика `onRehydrateStorage`, слияние настроек ESLint, селектор Zustand с новым объектом.
- Решения автора, которые изменили вывод агента: одна картинка на пост вместо двух (этап 1), один алиас `@/` вместо алиасов по слоям (этап 4), комментарии только «почему» (перед этапом 6), звезда в шапке вместо кнопки под текстом и стиль экранов (этап 6), `format:check` без новой зависимости (этап 6).
- Устойчивый урок: чаще всего ошибались утверждения о сторонних библиотеках, сделанные без запуска. Утверждения, проверенные запуском, выдержали все прогоны ревьюера.
