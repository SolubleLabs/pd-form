# Markdown Field

The **Markdown** field renders formatted text using the [Markdown](https://commonmark.org/) syntax. This field is ideal for instructions, long descriptions or any content requiring headings, lists, tables and links.

## Initial Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `markdown` | string | `""` | The Markdown source to render. |

## Param Reducers

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `setMarkdown(markdown)` | `(markdown: string) => void` | Sets the markdown content. |

## Example

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

const intro = builder.insertField('Markdown')
  .param.setMarkdown(`## Welcome\n\nPlease fill out the form below.\n\n* Answer all required questions.\n* Review your inputs before submission.`);

const descriptor = builder.descriptor();
```

In this example the Markdown field will render a second‑level heading and a bulleted list. You can include tables, links and other Markdown constructs as needed.
