// @deno-types="npm:@types/lodash"
import _ from "lodash";
import { nanoid } from "nanoid/non-secure";
import { Action, Reducer } from "redux";
import {
  FormSection,
  InsertArrayPosition,
  InsertFieldPosition,
} from "./schema/types.ts";

export function createUId(prefix?: string, check?: (string | number)[] | null) {
  const _c = check ?? [];
  let id;

  while (!id || _c.includes(id)) {
    id = nanoid(6);
  }

  return `${prefix}${id}`;
}

export const switchReducer =
  <K extends string, S, A extends Action<any>>(
    reducerMap: Record<K, Reducer<S, A>>
  ) =>
  <SK extends K>(
    key: SK,
    state: ReturnType<(typeof reducerMap)[SK]> | undefined,
    action: any
  ) => {
    if (!reducerMap[key]) return state;

    return reducerMap[key](state, action);
  };

export type SwitchReducer<S> = <K extends keyof S>(
  key: K,
  state: S,
  action: any
) => S[K];

export function createSection(
  title?: string,
  description?: string
): FormSection {
  return {
    sectionTitle: title ?? "",
    sectionDescription: description ?? "",
    fields: [],
  };
}

export function insertFieldToLayout(
  oldLayout: FormSection[] | undefined,
  toSectionIndex: number | undefined,
  fieldId: string,
  pos: InsertFieldPosition
) {
  const newLayout = [...(oldLayout ?? [])];

  // get section to write to
  let targetSection: FormSection;
  if (toSectionIndex == undefined || !newLayout[toSectionIndex]) {
    const newSection = createSection();
    targetSection = newSection;
    newLayout.push(newSection);
  } else {
    targetSection = {
      ...newLayout[toSectionIndex],
    };
    newLayout[toSectionIndex] = targetSection;
  }

  targetSection.fields = insertFieldToArray(targetSection.fields, pos, fieldId);

  return newLayout;
}

export function insertFieldToArray(
  list: string[],
  position: InsertFieldPosition,
  fieldId: string
) {
  switch (position[0]) {
    case "first":
      return [fieldId, ...list];
    case "before":
      return insertBeforeOrLast(list, position[1], fieldId);
    case "after":
      return insertAfterOrLast(list, position[1], fieldId);
    case "last":
    default:
      return [...list, fieldId];
  }
}

/**
 * return new Formsection[] where all matched fieldId are removed from all section.fields
 */
export function removeFieldFromLayout(
  oldLayout: FormSection[],
  fieldId: string
) {
  let removed = false;

  const newLayout = oldLayout.map((section) => {
    const idx = section.fields.indexOf(fieldId);

    if (idx >= 0) {
      removed = true;
      const b = section.fields.slice();
      b.splice(idx, 1);
      return {
        ...section,
        fields: b,
      };
    } else {
      return section;
    }
  });

  if (!removed) {
    console.warn(`No field matchd id "${fieldId}". Nothing removed`);
  }

  return newLayout;
}

export function insertArrayPosition<T>(
  list: T[],
  position: InsertArrayPosition,
  item: T
) {
  switch (position[0]) {
    case "first":
      return [item, ...list];
    case "after":
    case "before": {
      const b = list.slice();
      b.splice(
        position[0] === "before" ? position[1] : position[1] + 1,
        0,
        item
      );
      return b;
    }
    case "last":
    default:
      return [...list, item];
  }
}

export function insertAfterOrLast<T>(list: T[], search: T, item: T) {
  const idx = list.indexOf(search);
  if (idx < 0) {
    return [...list, item];
  } else {
    const b = list.slice();
    b.splice(idx + 1, 0, item);
    return b;
  }
}

export function insertBeforeOrLast<T>(list: T[], search: T, item: T) {
  const idx = list.indexOf(search);
  if (idx < 0) {
    return [...list, item];
  } else {
    const b = list.slice();
    b.splice(idx, 0, item);
    return b;
  }
}

export function moveUp(list: any[], index: number) {
  if (index > list.length - 1 || index == 0) return list;

  const b = [...list];
  const temp = b[index - 1];
  b[index - 1] = list[index];
  b[index] = temp;
  return b;
}

export function moveDown(list: any[], index: number) {
  if (index >= list.length - 1) return list;

  const b = [...list];
  const temp = b[index + 1];
  b[index + 1] = list[index];
  b[index] = temp;
  return b;
}

export function removeFieldRules(rules: Dictionary<any>, fieldId: string) {
  return _.omitBy(rules, (_: any, k: any) => k.startsWith(fieldId));
}

export function removeParamsRules(rules: Dictionary<any>, fieldId: string) {
  return _.omitBy(rules, (_: any, k: any) => k.startsWith(`${fieldId}.params`));
}

export function fallbackText(...args: any[]) {
  for (const v of args) {
    if (v != "" && v != null) return v;
  }
}
