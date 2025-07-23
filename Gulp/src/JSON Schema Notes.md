# JSON Schema Notes

---

## 🔧 **Basic Schema Keywords**

| Keyword       | Description                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `$schema`     | Declares the schema version (e.g., `"https://json-schema.org/draft/2020-12/schema"`).                       |
| `title`       | A short title for the schema or a property.                                                                 |
| `description` | A human-readable description.                                                                               |
| `type`        | Specifies the data type: `"string"`, `"number"`, `"integer"`, `"object"`, `"array"`, `"boolean"`, `"null"`. |

---

## 🧾 **Validation for Specific Types**

### **String**

| Keyword     | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `minLength` | Minimum number of characters.                                 |
| `maxLength` | Maximum number of characters.                                 |
| `pattern`   | Regex pattern the string must match.                          |
| `format`    | Built-in formats like `"email"`, `"uri"`, `"date-time"`, etc. |

### **Number / Integer**

| Keyword            | Description                        |
| ------------------ | ---------------------------------- |
| `minimum`          | Inclusive lower bound.             |
| `exclusiveMinimum` | Exclusive lower bound.             |
| `maximum`          | Inclusive upper bound.             |
| `exclusiveMaximum` | Exclusive upper bound.             |
| `multipleOf`       | Must be a multiple of this number. |

### **Array**

| Keyword       | Description                                       |
| ------------- | ------------------------------------------------- |
| `items`       | Schema of array items.                            |
| `minItems`    | Minimum number of items.                          |
| `maxItems`    | Maximum number of items.                          |
| `uniqueItems` | All items must be unique.                         |
| `contains`    | Must contain at least one item matching a schema. |

### **Object**

| Keyword                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `properties`           | Declares schemas for named properties.            |
| `required`             | Array of required property names.                 |
| `additionalProperties` | Controls whether extra properties are allowed.    |
| `minProperties`        | Minimum number of properties.                     |
| `maxProperties`        | Maximum number of properties.                     |
| `patternProperties`    | Keys matching regex patterns get certain schemas. |
| `propertyNames`        | Schema for property names themselves.             |

---

## 🎯 **Generic Keywords**

| Keyword      | Description                                         |
| ------------ | --------------------------------------------------- |
| `enum`       | List of permitted values.                           |
| `const`      | Must be exactly this value.                         |
| `default`    | Suggested default value.                            |
| `examples`   | Array of example values.                            |
| `deprecated` | Marks a property as deprecated (boolean).           |
| `readOnly`   | Used in APIs to indicate client cannot set it.      |
| `writeOnly`  | Used in APIs to indicate it should not be returned. |

---

## 🔄 **Logical Combinators**

| Keyword                | Description                          |
| ---------------------- | ------------------------------------ |
| `allOf`                | Must match **all** given schemas.    |
| `anyOf`                | Must match **at least one** schema.  |
| `oneOf`                | Must match **exactly one** schema.   |
| `not`                  | Must **not** match the given schema. |
| `if` / `then` / `else` | Conditional schemas.                 |

---

Awesome — that’ll be a solid reference to have at your fingertips. JSON Schema is deep but very composable, so keeping a modular cheat sheet is a great idea, especially as schemas grow more complex.

If you're building a lot of config schemas, consider including a section in your notes like:

### 💡 Common Patterns for Config Files

* Use `enum` + `description` for option lists.
* Use `default` to suggest fallback values.
* Use `examples` for clarity in validation tools.
* Use `additionalProperties: false` to enforce strictness.
* Use `patternProperties` when config keys follow a naming convention.

Let me know if you'd like snippets for things like:

* A reusable config block (e.g. logging options)
* Referencing external definitions (`$ref`)
* Conditionals (e.g. `"if": { "properties": { "mode": { "const": "advanced" } }, "then": { ... }`)

---

Great — here are some **modular JSON Schema snippets** for common config file patterns. You can drop these into your schema reference file and reuse them or expand them as needed.

---

## 🔁 Reusable Snippets for JSON Schema (Config-Oriented)

---

### ✅ 1. **Enum with Description & Default**

```json
{
  "type": "string",
  "description": "Log level for output verbosity",
  "enum": ["debug", "info", "warn", "error"],
  "default": "info"
}
```

---

### 🔌 2. **Toggle / Boolean Option**

```json
{
  "type": "boolean",
  "description": "Enable verbose logging",
  "default": false
}
```

---

### 🧱 3. **Reusable Object with `$defs` and `$ref`**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schema/config.schema.json",
  "type": "object",
  "properties": {
    "logging": { "$ref": "#/$defs/loggingConfig" }
  },
  "required": ["logging"],
  "$defs": {
    "loggingConfig": {
      "type": "object",
      "properties": {
        "level": {
          "type": "string",
          "enum": ["debug", "info", "warn", "error"],
          "default": "info"
        },
        "file": {
          "type": "string",
          "description": "Path to log output file"
        }
      },
      "required": ["level"]
    }
  }
}
```

---

### 🧪 4. **Conditional Schema: Based on a Mode**

```json
{
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "enum": ["basic", "advanced"]
    },
    "advancedSettings": {
      "type": "object"
    }
  },
  "if": {
    "properties": { "mode": { "const": "advanced" } }
  },
  "then": {
    "required": ["advancedSettings"]
  },
  "else": {
    "properties": {
      "advancedSettings": false
    }
  }
}
```

---

### 🧰 5. **Pattern-Based Dynamic Keys (`patternProperties`)**

```json
{
  "type": "object",
  "patternProperties": {
    "^plugin-[a-z]+$": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean", "default": true }
      },
      "required": ["enabled"]
    }
  },
  "additionalProperties": false
}
```

---

### 📋 6. **Top-Level Array of Named Items**

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "enabled": { "type": "boolean", "default": true }
    },
    "required": ["name"]
  }
}
```

---

If you want a full YAML-based config file to be schema-validated using these JSON Schema patterns, I can also show how to wire this up with tools like [AJV](https://ajv.js.org/), [YAML Schemas in VSCode](https://github.com/redhat-developer/yaml-language-server), or the GitHub `schemas/store`.

Want a sample YAML + schema validation setup next?

---

Perfect. Here's a full **working example** showing how to use a JSON Schema to validate a YAML config file, and how to integrate this into your tooling (e.g., VS Code or CI validation using AJV).

---

## ✅ **YAML Config + JSON Schema + Validation Setup**

---

### 🧾 Step 1: YAML Config (`myconfig.yaml`)

```yaml
mode: advanced
logging:
  level: debug
  file: ./logs/app.log
advancedSettings:
  optimization: true
```

---

### 📐 Step 2: JSON Schema (`myconfig.schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/myconfig.schema.json",
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "enum": ["basic", "advanced"]
    },
    "logging": {
      "type": "object",
      "properties": {
        "level": {
          "type": "string",
          "enum": ["debug", "info", "warn", "error"],
          "default": "info"
        },
        "file": {
          "type": "string",
          "description": "Log output path"
        }
      },
      "required": ["level"]
    },
    "advancedSettings": {
      "type": "object",
      "properties": {
        "optimization": { "type": "boolean" }
      }
    }
  },
  "required": ["mode", "logging"],
  "if": {
    "properties": { "mode": { "const": "advanced" } }
  },
  "then": {
    "required": ["advancedSettings"]
  },
  "else": {
    "properties": {
      "advancedSettings": false
    }
  }
}
```

---

### 🧪 Step 3: Validate with AJV (Node.js example)

Install [AJV](https://ajv.js.org/):

```bash
npm install ajv ajv-formats yaml
```

Minimal validation script (`validate.js`):

```js
import fs from 'fs';
import YAML from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('./myconfig.schema.json', 'utf-8'));
const yamlContent = fs.readFileSync('./myconfig.yaml', 'utf-8');
const config = YAML.parse(yamlContent);

const validate = ajv.compile(schema);
const valid = validate(config);

if (valid) {
  console.log("✅ Config is valid!");
} else {
  console.error("❌ Config is invalid:", validate.errors);
}
```

Run it:

```bash
node validate.js
```

---

### 💻 Bonus: Enable in VSCode for Autocomplete + Errors

Install [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) (Red Hat).

In your workspace settings (`.vscode/settings.json`), link the schema:

```json
{
  "yaml.schemas": {
    "./myconfig.schema.json": "myconfig.yaml"
  }
}
```

Now, VSCode will:

* Suggest enum values (`debug`, `info`, etc.)
* Show tooltips for `description`
* Mark errors in YAML if it violates schema

