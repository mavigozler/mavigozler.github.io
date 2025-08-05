# YAML Quick Reference

## Convenstions for name keys/properties

It often depends on the ecosystem:

| Style        | Example            | Typical Use Cases                          |
|--------------|--------------------|--------------------------------------------|
| `snake_case` | `user_name`        | Python, CircleCI, GitLab, Ansible          |
| `kebab-case` | `user-name`        | CSS, Jenkins, Azure, Spring Boot           |
| `camelCase`  | `userName`         | JavaScript, Kubernetes, Spring             |
| `PascalCase` | `UserName`         | C#, class/type names (less common in YAML) |

## When do you have to quote values?

```yaml
greeting: "Hello, world!"  # when special characters present
value: @mydrive  # when a value starts with @, &, *, % or !, which are special to YAML
zip_code: "00123"  # if numeric values start with zero (0)
username: "   admin  "  # if you want to preserve leading/trailing whitespace
time: "08:00 PM"  # any value with a colon, which YAML treats as key:value pair
response: "false"   # it could be a YAML boolean or null, but is not
status: "null"
```

## 🧩 Basic Syntax

- **Key-value pairs**:  

  ```yaml
  name: John Doe
  age: 30
  ```

- **Lists**:  

  ```yaml
  fruits:
    - Apple
    - Banana
    - Cherry
  ```

  Or inline:  

  ```yaml
  fruits: [Apple, Banana, Cherry]
  ```

- **Nested objects** (use spaces, not tabs):  

  ```yaml
  person:
    name: John
    address:
      city: Exampleville
      zip: 12345
  ```

- **Comments**:  

  ```yaml
  # This is a comment
  ```

## 🔤 Data Types

- **Strings**: `'text'` or `"text"` or just `text`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`, `~`
- **Dates**: `2025-07-30`

---

## 📚 Advanced Features

- **Multiline strings**:  

  ```yaml
  description: |
    This is line one.
    This is line two.
  ```

  Folded style:  

  ```yaml
  description: >
    This will be folded
    into a single line.
  ```

- **Anchors & Aliases**:  

  ```yaml
  defaults: &defaults
    color: red
    size: medium

  item1:
    <<: *defaults
    name: T-shirt
  ```

- **Multiple documents**:  

  ```yaml
  ---
  doc: First
  ---
  doc: Second
  ```

## 🧠 Handy Tips

- YAML is **case-sensitive**
- **No tabs**—use spaces for indentation
- File extensions: `.yaml` or `.yml`
- YAML is a **superset of JSON**
