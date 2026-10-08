// FSD layers, top to bottom. A layer may import only the layers after it.
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const SLICE_LAYERS = LAYERS.slice(0, -1);

const ENRICH_FILES = [
  'src/entities/post/lib/enrich.ts',
  'src/entities/post/lib/enrich.test.ts',
];

const MULTILINE = ['multiline-const', 'multiline-let', 'multiline-expression'];

const fakerRestriction = {
  paths: [
    {
      name: '@faker-js/faker',
      message: 'Invariant 2 (R-2): faker only in post enrichment.',
    },
  ],
  patterns: [
    {
      group: ['@faker-js/faker/*'],
      message: 'Invariant 2 (R-2): faker only in post enrichment.',
    },
  ],
};

module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['boundaries', 'check-file', '@stylistic'],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
    },
    'boundaries/include': ['src/**/*'],
    // Elements are slices; in shared, modules with their own index.ts.
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      ...SLICE_LAYERS.slice(1).map(type => ({
        type,
        pattern: `src/${type}/*`,
        capture: ['slice'],
      })),
      {
        type: 'shared',
        pattern: 'src/shared/(lib|config)/*',
        capture: ['segment', 'slice'],
      },
      { type: 'shared', pattern: 'src/shared/*', capture: ['slice'] },
    ],
  },
  rules: {
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{js,jsx,ts,tsx}': 'KEBAB_CASE' },
      // load-posts.test.ts: only the part before the first dot is checked.
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': [
      'error',
      { 'src/**/': 'KEBAB_CASE' },
    ],
    // The core rule is deprecated since ESLint 8.53. The last matching entry wins.
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'always',
        prev: 'expression',
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'never',
        prev: ['singleline-const', 'singleline-let'],
        next: ['singleline-const', 'singleline-let'],
      },
      { blankLine: 'always', prev: '*', next: MULTILINE },
      { blankLine: 'always', prev: MULTILINE, next: '*' },
    ],
    'no-restricted-imports': ['error', fakerRestriction],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name=/^(onRefresh|refreshControl)$/]',
        message: 'Invariant 5 (R-4): no pull-to-refresh.',
      },
    ],
    'no-restricted-properties': [
      'error',
      ...['clearStorage', 'clearAll'].map(property => ({
        property,
        message: 'Invariant 5 (R-4): no data reset.',
      })),
    ],
    // The last matching policy wins.
    'boundaries/dependencies': [
      'error',
      {
        default: 'allow',
        policies: [
          {
            disallow: { to: { element: { types: LAYERS } } },
            message:
              'R-10: import another slice only through its public API (index.ts).',
          },
          {
            allow: {
              to: { element: { types: LAYERS, fileInternalPath: 'index.ts' } },
            },
          },
          { allow: { dependency: { relationship: { to: 'internal' } } } },
          ...LAYERS.slice(1).map((layer, i) => ({
            from: { element: { type: layer } },
            disallow: { to: { element: { types: LAYERS.slice(0, i + 1) } } },
            message: `R-10: ${layer} must not import upper layers.`,
          })),
        ],
      },
    ],
  },
  overrides: [
    {
      files: ENRICH_FILES,
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
};
