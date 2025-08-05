# Condition Calculable

The **Condition** calculable evaluates boolean expressions over multiple fields and returns `true` or `false`. It is typically used to control overridable paths such as `hidden` or `required` on fields.

## Type

Returns: **boolean**

## Initial Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `conditionGroups` | `ConditionGroup[]` | See description | Array of condition groups. Each group contains a list of conditions and logic joining rules. |

Each **ConditionGroup** has these fields:

| Field | Type | Description |
|------|------|-------------|
| `joinWithPrev` | `'and'` • `'or'` • `'nor'` | How to combine this group's result with the result of previous groups. |
| `joinInside` | `'and'` • `'or'` • `'nor'` | How to combine the conditions inside this group. |
| `conditions` | `ConditionType[]` | An array of conditions `[fieldId, operator, compareValue]`. |

Each **ConditionType** is a tuple `[fieldId, operator, compareTo]` where:

| Element | Description |
|--------|-------------|
| `fieldId` | The ID of the field whose value is compared. If undefined, the condition is ignored. |
| `operator` | One of `'=='`, `'!='`, `'is-empty'`. |
| `compareTo` | The value to compare against (ignored when operator is `'is-empty'`). |

When you build programmatically (`schema.programmatic()`), the default `conditionGroups` is an empty array. In UI mode a default single group with one empty condition is provided.

## Param Reducers

The rule handle exposes a set of reducers to build complex condition trees:

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `addConditionGroup(conditionGroup?)` | `(group?: ConditionGroup) => void` | Appends a new group. If no argument is provided, a default group is created. |
| `addCondition(groupIndex)` | `(groupIndex: number) => void` | Adds a new condition to the group at `groupIndex`. |
| `removeCondition(groupIndex, condIndex)` | `(groupIndex: number, condIndex: number) => void` | Removes the specified condition; removes the group if it becomes empty. |
| `setCompareValue(groupIndex, condIndex, value)` | `(groupIndex: number, condIndex: number, value: any) => void` | Sets the comparison value. |
| `setCompareField(groupIndex, condIndex, fieldId)` | `(groupIndex: number, condIndex: number, fieldId: string | undefined) => void` | Sets the field to compare. |
| `setOutsideLogic(groupIndex, logic)` | `(groupIndex: number, logic: 'and' | 'or' | 'nor') => void` | Sets how this group is combined with previous groups. |
| `setInsideLogic(groupIndex, logic)` | `(groupIndex: number, logic: 'and' | 'or' | 'nor') => void` | Sets how conditions inside this group are combined. |
| `setOperator(groupIndex, condIndex, op)` | `(groupIndex: number, condIndex: number, op: '==' | '!=' | 'is-empty') => void` | Sets the operator; if `'is-empty'` the comparison value is cleared. |

## Usage Example

Hide the Comments field when the Age field is empty **or** less than 18:

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Age field
const age = builder.insertField('Std.ScoreField')
  .param.setLabel('Age')
  .param.fieldProps.addChoice({ value: 18, label: '18' })
  .param.fieldProps.addChoice({ value: 21, label: '21' });

// Comments field
const comments = builder.insertField('Std.TextInput')
  .param.setLabel('Comments');

// Create condition: comments.hidden = (age is empty) OR (age != 18)
const rule = comments.addRule('hidden', 'Condition');
// Condition 1: age is empty
rule.setCompareField(0, 0, age.fieldId);
rule.setOperator(0, 0, 'is-empty');
// Add a second condition to the same group
rule.addCondition(0);
rule.setCompareField(0, 1, age.fieldId);
rule.setOperator(0, 1, '!=');
rule.setCompareValue(0, 1, 18);
// Combine conditions with 'or'
rule.setInsideLogic(0, 'or');

const descriptor = builder.descriptor();
```

## Logic Semantics

*Within a group*: conditions are reduced according to `joinInside`:

| Logic | Meaning |
|-------|---------|
| `and` | All conditions must be true for the group to be true. |
| `or` | At least one condition must be true. |
| `nor` | None of the conditions may be true. |

*Across groups*: results of groups are combined via `joinWithPrev`:

| Logic | Meaning |
|-------|---------|
| `and` | True only if both this group and previous result are true. |
| `or` | True if either this group or previous result is true. |
| `nor` | True only if both this group and previous result are false. |

The final boolean is returned by the calculable and is applied to the overridable path.
