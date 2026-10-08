# lorem-feed

React Native take-home: a posts list, a post details screen, favorites pinned to the top. Data is fetched once and persisted across launches. All requirements and decisions live in the file below. Do not restate them, reference their IDs (F-*, D-*, I-*, R-*).

@docs/requirements.md

## Stack
Exact versions are pinned in `package.json` (no ranges) and `yarn.lock`.
Everything installed by the RN CLI template is approved; the approval rule applies to packages added on top of it.
- React Native 0.87.1, React 19.2.3, bare React Native CLI 20.2.0, New Architecture on
- TypeScript 6.0.3 (the version pinned by the RN template)
- React Navigation 7: `@react-navigation/native` 7.5.0, `@react-navigation/native-stack` 7.20.0, plus peers `react-native-screens` 4.28.0, `react-native-safe-area-context` 5.10.1
- `@faker-js/faker` 10.6.0
- `zustand` 5.0.15 with `persist`
- `react-native-mmkv` 4.3.2 + `react-native-nitro-modules` 0.37.1
- Jest 29.7.0, ESLint 8.57.1, Prettier 2.8.8 (from the RN template)
- `eslint-plugin-boundaries` 7.2.0 (dev, FSD import rules; approved 2026-10-08)
- `babel-plugin-module-resolver` 5.0.3, `eslint-import-resolver-typescript` 4.4.5 (dev, the `@/` alias; approved 2026-10-08)
- `eslint-plugin-check-file` 2.8.0, `@stylistic/eslint-plugin` 3.1.0 (dev, code style rules; approved 2026-10-08). The last versions that support ESLint 8
- Yarn 4.18.1, shipped in the repo (`.yarn/releases`, `yarnPath` in `.yarnrc.yml`); Corepack is optional. `nodeLinker: node-modules`
- Node `^22.13.0 || ^24.3.0` (`.nvmrc`: 24.14.0)

## Forbidden
- Any `expo*` or `@expo/*` package.
- Any dependency not listed above without the author's approval. Ask and wait.
- RTK Query, TanStack Query.
- Pull-to-refresh (`refreshControl`, `onRefresh`).
- A data-reset button in the UI (R-4).

## Architecture: FSD (R-10)
Layers, top to bottom: `app → pages → widgets → features → entities → shared`.
- A layer imports only from layers below it.
- Cross-slice imports go only through the slice's public API (`index.ts`). No deep imports into another slice.
- Inside a slice use relative imports.
- Across slices and layers import via the `@/` alias (`@/entities/post`). It is set in `tsconfig.json` and `babel.config.js`; keep them in sync.

## Code style
Enforced by `yarn lint` (see `.eslintrc.js`): kebab-case file and folder names (`check-file`), blank lines between statements (`@stylistic/padding-line-between-statements`).

Enforced by `yarn format:check` (`prettier --check .`, see `.prettierignore`): Prettier formatting. Lint does not check formatting: `@react-native` only turns off rules that conflict with Prettier. Fix with `yarn format`.

Not enforced by lint:
- File names are kebab-case, exports keep their own case: `posts-screen.tsx` exports `PostsScreen`.
- Rename files with `git mv`.
- A comment explains only "why": a non-obvious decision, a reference to an invariant, or a workaround for a library bug. No comments that restate the code, no file headers.

## Invariants
1. `/posts` is fetched only until the first success, then never again. Success means a non-empty, valid list; an empty or invalid response is not a success and stores nothing (D-1, D-3, R-4).
2. The image seed is generated once, during list enrichment, and stored with the post. Both picsum URLs are built from the stored seed by a pure function. Faker is never called and no seed is generated during render (D-2, R-2).
3. `/posts/{id}` is fetched only when the post's details are not cached. On error nothing is stored and the next open retries. After the first success it is never fetched again (R-3).
4. The load / no-load decision is made only after every persist store has finished hydrating from MMKV, successfully or after recovery. The hydration gate guarantees it: navigation and all screens render only after the gate opens (R-9).
5. No pull-to-refresh, no data-reset button (R-4).

## Commands
```sh
yarn install      # install deps (+ pod install on macOS)
yarn ios
yarn android
yarn lint
yarn typecheck    # tsc --noEmit
yarn test
yarn format:check # prettier --check .
yarn format       # prettier --write .
```

## Definition of done (every step)
- `yarn typecheck`, `yarn lint`, `yarn format:check`, `yarn test` are green.
- `docs/ai/JOURNAL.md` is updated.

## Languages
- English: code, comments, commit messages, everything in `.claude/`, this file.
- Russian: README, everything in `docs/` (including `docs/requirements.md` and `docs/ai/`).
- UI: English only. Russian wording from the author describes meaning, not literal UI strings.

## Process
- Follow the `take-home` skill. After every stage stop and wait for the author's explicit confirmation.
- Never resolve an ambiguity silently. Mark inferences as unconfirmed and ask.
- Commit only when asked.
- Never commit the `DEVELOPMENT_TEAM` setting in `ios/LoremFeed.xcodeproj/project.pbxproj`: it is the author's local signing setup. Stage files explicitly and leave that change unstaged. If other changes to that file are needed, ask first.
