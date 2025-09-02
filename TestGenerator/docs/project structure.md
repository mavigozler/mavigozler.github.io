# Typical or class project structure for web app development

```cmd
my-app/
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level components (if using React/Next.js)
│   ├── services/         # API calls, business logic
│   ├── utils/            # Helper functions, type guards, etc.
│   ├── types/            # Global TypeScript types/interfaces
│   ├── config/           # App-wide config (env, constants, etc.)
│   ├── hooks/            # Custom React hooks (if applicable)
│   └── index.tsx         # Entry point (or main.ts for non-React apps)
│
├── public/               # Static assets (images, fonts, etc.)
│
├── tests/                # Unit and integration tests
│
├── dist/                 # Compiled output (auto-generated)
│
├── node_modules/         # Dependencies (auto-generated)
│
├── .env                  # Environment variables
├── tsconfig.json         # TypeScript config
├── package.json          # Project metadata and scripts
└── README.md             # Project overview
```
