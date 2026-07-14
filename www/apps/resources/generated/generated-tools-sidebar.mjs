const generatedgeneratedToolsSidebarSidebar = {
  "sidebar_id": "tools",
  "title": "Tools",
  "items": [
    {
      "loaded": true,
      "isPathHref": true,
      "type": "link",
      "title": "Overview",
      "path": "/tools",
      "children": []
    },
    {
      "loaded": true,
      "isPathHref": true,
      "type": "category",
      "title": "CLI Tools",
      "initialOpen": true,
      "description": "CLI tools help you setup Medusa, manage the database, and more.",
      "children": [
        {
          "loaded": true,
          "isPathHref": true,
          "type": "link",
          "path": "/create-medusa-app",
          "title": "create-medusa-app",
          "children": []
        },
        {
          "loaded": true,
          "isPathHref": true,
          "type": "sidebar",
          "sidebar_id": "medusa-cli",
          "title": "Medusa CLI",
          "childSidebarTitle": "Medusa CLI Reference",
          "initialOpen": true,
          "children": [
            {
              "loaded": true,
              "isPathHref": true,
              "type": "link",
              "path": "/medusa-cli",
              "title": "Overview",
              "children": []
            },
            {
              "type": "separator"
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "Commands",
              "autogenerate_path": "medusa-cli/commands",
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/new",
                  "title": "new",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/develop",
                  "title": "develop",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/start",
                  "title": "start",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/user",
                  "title": "user",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/build",
                  "title": "build",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/db",
                  "title": "db",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/lint",
                  "title": "lint",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/plugin",
                  "title": "plugin",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/exec",
                  "title": "exec",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/telemtry",
                  "title": "telemetry",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/medusa-cli/commands/codemod",
                  "title": "codemod",
                  "description": "",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "loaded": true,
          "isPathHref": true,
          "type": "link",
          "path": "/medusa-oas-cli",
          "title": "medusa-oas-cli",
          "children": []
        }
      ]
    },
    {
      "loaded": true,
      "isPathHref": true,
      "type": "category",
      "title": "Developer Tools",
      "initialOpen": true,
      "description": "Developer tools facilitate the development of your Medusa application by providing utilities for linting and other uses.",
      "children": [
        {
          "loaded": true,
          "isPathHref": true,
          "type": "sidebar",
          "sidebar_id": "lint",
          "title": "ESLint Plugin",
          "childSidebarTitle": "ESLint Plugin Reference",
          "initialOpen": true,
          "children": [
            {
              "loaded": true,
              "isPathHref": true,
              "type": "link",
              "path": "/lint",
              "title": "Overview",
              "children": []
            },
            {
              "type": "separator"
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "Rules",
              "autogenerate_path": "lint/rules",
              "initialOpen": true,
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/lint/rules",
                  "title": "ESLint Plugin Rules",
                  "description": "",
                  "children": [
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/admin-component-must-be-arrow-function",
                      "title": "admin-component-must-be-arrow-function",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/admin-env-vars-import-meta",
                      "title": "admin-env-vars-import-meta",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/admin-no-medusa-utils-import",
                      "title": "admin-no-medusa-utils-import",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/authenticate-flag-name-and-type",
                      "title": "authenticate-flag-name-and-type",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/data-model-table-name-snake-case",
                      "title": "data-model-table-name-snake-case",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/import-from-framework-not-internal",
                      "title": "import-from-framework-not-internal",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/link-create-keys-modules-enum",
                      "title": "link-create-keys-modules-enum",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/link-no-cross-module-relationship",
                      "title": "link-no-cross-module-relationship",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/link-uses-linkable-properties",
                      "title": "link-uses-linkable-properties",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/loader-must-be-exported-in-module-definition",
                      "title": "loader-must-be-exported-in-module-definition",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/medusa-context-on-context-param",
                      "title": "medusa-context-on-context-param",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/middleware-must-call-next",
                      "title": "middleware-must-call-next",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/middlewares-file-location-and-name",
                      "title": "middlewares-file-location-and-name",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/module-name-snake-case",
                      "title": "module-name-snake-case",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-async-workflow-constructor",
                      "title": "no-async-workflow-constructor",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-conditional-expressions-in-workflow",
                      "title": "no-conditional-expressions-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-config-on-dynamic-ui-route",
                      "title": "no-config-on-dynamic-ui-route",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-console-log-in-workflow",
                      "title": "no-console-log-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-deprecated-remote-query-config",
                      "title": "no-deprecated-remote-query-config",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-direct-variable-mutation-in-workflow",
                      "title": "no-direct-variable-mutation-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-duplicate-step-id-in-workflow",
                      "title": "no-duplicate-step-id-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-if-in-workflow-constructor",
                      "title": "no-if-in-workflow-constructor",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-loops-in-workflow",
                      "title": "no-loops-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-mikroorm-direct-import",
                      "title": "no-mikroorm-direct-import",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-new-date-in-workflow",
                      "title": "no-new-date-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-non-serializable-step-return",
                      "title": "no-non-serializable-step-return",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-reserved-default-properties-in-model",
                      "title": "no-reserved-default-properties-in-model",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-service-mutations-in-api-route",
                      "title": "no-service-mutations-in-api-route",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-spread-in-workflow",
                      "title": "no-spread-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-throw-in-transform",
                      "title": "no-throw-in-transform",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-trailing-slash-in-route-matcher",
                      "title": "no-trailing-slash-in-route-matcher",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-try-catch-in-workflow",
                      "title": "no-try-catch-in-workflow",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/no-workflow-call-without-container",
                      "title": "no-workflow-call-without-container",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/prefer-container-registration-keys",
                      "title": "prefer-container-registration-keys",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/prefer-link-over-remote-link",
                      "title": "prefer-link-over-remote-link",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/prefer-modules-enum",
                      "title": "prefer-modules-enum",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/prices-in-major-units",
                      "title": "prices-in-major-units",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/primary-key-required",
                      "title": "primary-key-required",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/read-only-link-requires-field",
                      "title": "read-only-link-requires-field",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/route-dynamic-folder-syntax",
                      "title": "route-dynamic-folder-syntax",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/route-file-naming",
                      "title": "route-file-naming",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/route-handler-exports-uppercase",
                      "title": "route-handler-exports-uppercase",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/route-params-must-be-defined",
                      "title": "route-params-must-be-defined",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/scheduled-job-config-required",
                      "title": "scheduled-job-config-required",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/scheduled-job-default-export-async",
                      "title": "scheduled-job-default-export-async",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/scheduled-job-default-export-required",
                      "title": "scheduled-job-default-export-required",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/scheduled-job-name-unique",
                      "title": "scheduled-job-name-unique",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/scheduled-job-schedule-valid-cron",
                      "title": "scheduled-job-schedule-valid-cron",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/service-constructor-must-call-super",
                      "title": "service-constructor-must-call-super",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/service-methods-must-be-async",
                      "title": "service-methods-must-be-async",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/step-id-kebab-case",
                      "title": "step-id-kebab-case",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/step-must-return-step-response",
                      "title": "step-must-return-step-response",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/subscriber-config-export-required",
                      "title": "subscriber-config-export-required",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/subscriber-default-export-must-be-async",
                      "title": "subscriber-default-export-must-be-async",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/subscriber-default-export-required",
                      "title": "subscriber-default-export-required",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/ui-route-config-via-define-route-config",
                      "title": "ui-route-config-via-define-route-config",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/ui-route-file-name-page-tsx",
                      "title": "ui-route-file-name-page-tsx",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/ui-route-must-have-default-export",
                      "title": "ui-route-must-have-default-export",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/use-inject-manager-on-public-methods",
                      "title": "use-inject-manager-on-public-methods",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/use-medusa-error-not-generic-error",
                      "title": "use-medusa-error-not-generic-error",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/use-query-context-utility",
                      "title": "use-query-context-utility",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/use-validated-body-or-query",
                      "title": "use-validated-body-or-query",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/widget-must-export-config",
                      "title": "widget-must-export-config",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/widget-must-have-default-export",
                      "title": "widget-must-have-default-export",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/widget-zone-must-be-string-literal",
                      "title": "widget-zone-must-be-string-literal",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/workflow-id-matches-export-or-filename",
                      "title": "workflow-id-matches-export-or-filename",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/workflow-must-return-workflow-response",
                      "title": "workflow-must-return-workflow-response",
                      "description": "",
                      "children": []
                    },
                    {
                      "loaded": true,
                      "isPathHref": true,
                      "type": "link",
                      "path": "/lint/rules/zod-import-source",
                      "title": "zod-import-source",
                      "description": "",
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "loaded": true,
      "isPathHref": true,
      "type": "category",
      "title": "SDKs",
      "initialOpen": true,
      "description": "SDKs help you build client applications, such as storefronts or admin dashboards, with Medusa. They're also useful when extending the Medusa Admin with widgets and UI routes.",
      "children": [
        {
          "loaded": true,
          "isPathHref": true,
          "type": "sidebar",
          "sidebar_id": "js-sdk",
          "title": "JS SDK",
          "childSidebarTitle": "JS SDK Reference",
          "children": [
            {
              "loaded": true,
              "isPathHref": true,
              "type": "link",
              "path": "/js-sdk",
              "title": "Overview",
              "children": []
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "link",
              "path": "/js-sdk/auth/overview",
              "title": "Authentication",
              "children": []
            },
            {
              "type": "separator"
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "auth Methods",
              "autogenerate_path": "/references/js_sdk/auth/Auth/methods",
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.callback",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.login",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.logout",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.refresh",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.register",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.resetPassword",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.updateProvider",
                  "title": "",
                  "description": "",
                  "children": []
                }
              ]
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "store Methods",
              "autogenerate_path": "/references/js_sdk/store/Store/properties",
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.cart",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.category",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.collection",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.customer",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.fulfillment",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.locale",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.order",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.payment",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.product",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.productOption",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/store/Store/properties/js_sdk.store.Store.region",
                  "title": "",
                  "description": "",
                  "children": []
                }
              ]
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "admin Methods",
              "autogenerate_path": "/references/js_sdk/admin/Admin/properties",
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.apiKey",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.campaign",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.claim",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.currency",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.customer",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.customerGroup",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.draftOrder",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.exchange",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.fulfillment",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.fulfillmentProvider",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.fulfillmentSet",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.inventoryItem",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.invite",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.layouts",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.locale",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.notification",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.order",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.orderEdit",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.payment",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.paymentCollection",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.plugin",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.priceList",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.pricePreference",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.product",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productCategory",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productCollection",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productOption",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productTag",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productType",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.productVariant",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.promotion",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.rbacPolicy",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.rbacRole",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.refundReason",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.region",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.reservation",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.return",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.returnReason",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.salesChannel",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.shippingOption",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.shippingOptionType",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.shippingProfile",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.stockLocation",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.store",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.taxProvider",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.taxRate",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.taxRegion",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.translation",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.upload",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.user",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.views",
                  "title": "",
                  "description": "",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/references/js_sdk/admin/Admin/properties/js_sdk.admin.Admin.workflowExecution",
                  "title": "",
                  "description": "",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "loaded": true,
      "isPathHref": true,
      "type": "category",
      "title": "Storefront Starters",
      "initialOpen": true,
      "description": "A storefront starter is a storefront with the basic commerce features that you can use with your Medusa application. You can use it as-is or build on top of it. Learn more about building a storefront in the [Storefront Development](/storefront-development) documentation.",
      "children": [
        {
          "loaded": true,
          "isPathHref": true,
          "type": "sidebar",
          "sidebar_id": "nextjs-starter",
          "title": "Next.js Starter Storefront",
          "children": [
            {
              "loaded": true,
              "isPathHref": true,
              "type": "link",
              "path": "/nextjs-starter",
              "title": "Overview",
              "children": []
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "How-to Guides",
              "initialOpen": true,
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/nextjs-starter/guides/revalidate-cache",
                  "title": "Revalidate Cache",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/nextjs-starter/guides/remove-country-code",
                  "title": "Remove Country Code from URLs",
                  "children": []
                }
              ]
            },
            {
              "loaded": true,
              "isPathHref": true,
              "type": "category",
              "title": "Tutorials",
              "autogenerate_tags": "nextjs+tutorial",
              "autogenerate_as_ref": true,
              "sort_sidebar": "alphabetize",
              "children": [
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Add Gift Message",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/gift-message",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/nextjs-starter/guides/storefront-returns",
                  "title": "Create Order Returns",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Customer Tiers",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/customer-tiers",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "First-Purchase Discount",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/first-purchase-discounts",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Generate Invoices",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/invoice-generator",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Implement Pre-Orders",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/preorder",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Implement Product Builder",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-builder",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Implement Product Rentals",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/product-rentals",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Megamenu and Category Banner",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/category-images",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Saved Payment Methods",
                  "path": "https://docs.medusajs.com/resources/how-to-tutorials/tutorials/saved-payment-methods",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "ref",
                  "title": "Ticket Booking Storefront",
                  "path": "https://docs.medusajs.com/resources/recipes/ticket-booking/example/storefront",
                  "children": []
                },
                {
                  "loaded": true,
                  "isPathHref": true,
                  "type": "link",
                  "path": "/nextjs-starter/guides/customize-stripe",
                  "title": "Use Stripe's Payment Element",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "loaded": true,
      "isPathHref": true,
      "type": "external",
      "title": "Medusa UI",
      "path": "https://docs.medusajs.com/ui",
      "children": []
    }
  ]
}

export default generatedgeneratedToolsSidebarSidebar