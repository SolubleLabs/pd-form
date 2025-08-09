# Branching Logic Example

This example shows how to attach a condition rule to hide a field based on the value of another field. The rule uses the `Condition` calculable class: when the `Age` field is empty, the `Comments` field becomes hidden.

## How to run

```bash
npm install pd-form-core
npx ts-node index.ts
```

Review the printed descriptor to see how the rule appears in the `rules` object.
