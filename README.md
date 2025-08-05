<!--
  README for pd-form-core
  Last updated: 2025-08-06
-->

<h1 align="center">pd-form-core</h1>

<p align="center">
  <em>Type-safe Form Builder & Schema engine for PDPlus / PDClinic questionnaires</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/pd-form-core">
    <img alt="npm version" src="https://img.shields.io/npm/v/pd-form-core?logo=npm">
  </a>
  <a href="https://github.com/solublelabs/pd-form-core/actions">
    <img alt="build" src="https://github.com/solublelabs/pd-form-core/actions/workflows/ci.yml/badge.svg">
  </a>
  <img alt="license" src="https://img.shields.io/badge/license-proprietary-lightgrey">
</p>

> **pd-form-core** provides a strictly typed TypeScript API for describing complex medical questionnaires **once** and exporting them as portable JSON descriptors ready for deployment in Chula PD projects.  
> It is the foundation used internally by **PDPlus** and **PDClinic**, but is published for clinicians and developers affiliated with the Center of Excellence of Parkinson’s Disease and Related Disorders (<https://www.chulapd.org/>).

---

## Installation

```bash
# with npm
npm install pd-form-core

# or with pnpm
pnpm add pd-form-core
```

The package is published as **`pd-form-core`** on npm. It ships as **ESM + CJS**, fully tree‑shakeable and has no runtime dependencies beyond those listed in its `package.json`.

---

## Quick Start

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Insert a simple text input field
const nameField = builder.insertField('Std.TextInput')
  .param.setLabel('Patient Name')
  .param.setPlaceholder('e.g. John Doe');

// Export the immutable JSON descriptor
const descriptor = builder.descriptor();
console.log(JSON.stringify(descriptor, null, 2));
```

> **Tip:** `FormBuilder` is fluent—most param mutators return the same chainable handle.

---

## Key Features

| Feature | Why it matters |
|---------|----------------|
| **Type‑safe FormBuilder** | Compile‑time assurance that every field, rule & param is valid before JSON export |
| **Schema‑driven** | Separate *what* a form is (descriptor) from *how* it’s rendered; ship identical questionnaires to web, mobile, or future engines |
| **Calculables (rules engine)** | Built‑in *Condition* & *Summation* classes let you compute hidden fields, branching logic, scores, etc. |
| **Redux Toolkit & Zustand ready** | Editor & Viewer stores already wired—drop into React or React‑Native with minimal glue |
| **Programmatic vs UI mode** | `schema.programmatic()` toggles behaviour so you can seed default forms or build them interactively |
| **Deno friendly** | `// @deno-types` hints included; no Node‑specific APIs in core |

---

## Mini API

| Method | Description |
|--------|-------------|
| **`insertField(fieldClass, id?)`** | Adds a field to section 0 (creates the section if missing). Returns a `FieldHandle`. |
| **`insertFooter(fieldClass, id?)`** | Adds a field to the footer section. Returns a `FieldHandle`. |
| **`descriptor()`** | Captures the current form definition as an immutable `FormDescriptor` object ready for serialization. |

For a complete listing of methods (including chainable param and rule helpers), see the [FormBuilder guide](docs/form-builder.md).  
To learn how to build custom schemas, jump to the [Extending the Schema](docs/form-builder.md#extending-the-schema) section of the guide.

---

## License

© 2025 Soluble Labs Co., Ltd. All rights reserved. Redistribution and use without explicit written permission is prohibited.

*pd-form-core is not an FDA‑cleared medical device; it is a developer tool for form specification.*

---

## Keywords

parkinsons · questionnaire · form‑builder · typescript · redux · json‑schema
