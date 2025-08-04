export type ConditionGroup = {
  joinWithPrev: Logic;
  joinInside: Logic;
  /**
   * array of `[fieldId, operator, compare string]`
   */
  conditions: ConditionType[];
};
import { Builder } from "../types.ts";

export type Logic = "and" | "or" | "nor"; // alloff, anyof ,noneof
export type Operator = "==" | "!=" | "is-empty";
/** [fieldId, operator, compareToString] */
export type ConditionType = [string | undefined, Operator, any];

export function calculableCondition(t: Builder) {
  return t.calculable("Condition", {
    type: "boolean",
    initialParams: {
      conditionGroups: t.programmatic
        ? []
        : ([
            {
              joinWithPrev: "and",
              joinInside: "or",
              conditions: [[undefined, "==", undefined]],
            },
          ] as ConditionGroup[]),
    },
    calculate: ({ data, params }) => {
      const { conditionGroups } = params;
      let result: boolean | undefined;
      for (const { joinWithPrev, joinInside, conditions } of conditionGroups) {
        result = joinCondition(result, joinWithPrev, () => {
          let insideResult: boolean | undefined;

          for (const cond of conditions) {
            // ignore if field or op is falsy
            const [field, op] = cond;
            if (!field || !op) continue;
            insideResult = joinCondition(insideResult, joinInside, () =>
              evalCondition(data, cond)
            );
          }
          return insideResult;
        });
      }

      return result;
    },
    paramReducers: {
      addConditionGroup: (p, conditionGroup?: ConditionGroup) => {
        p.conditionGroups.push(
          conditionGroup ?? {
            joinWithPrev: "and",
            joinInside: "or",
            conditions: [[undefined, "==", undefined]],
          }
        );
      },
      addCondition: (p, groupIndex: number) => {
        p.conditionGroups[groupIndex].conditions.push([
          undefined,
          "==",
          undefined,
        ]);
      },
      removeCondition: (p, groupIndex: number, condIndex: number) => {
        p.conditionGroups[groupIndex].conditions.splice(condIndex, 1);
        if (p.conditionGroups[groupIndex].conditions.length == 0)
          p.conditionGroups.splice(groupIndex, 1);
      },
      setCompareValue: (
        p,
        groupIndex: number,
        condIndex: number,
        value: any
      ) => {
        p.conditionGroups[groupIndex].conditions[condIndex][2] = value;
      },
      setCompareField: (
        p,
        groupIndex: number,
        condIndex: number,
        fieldId: string | undefined
      ) => {
        p.conditionGroups[groupIndex].conditions[condIndex][0] = fieldId;
      },
      setOutsideLogic: (p, groupIndex: number, logic: Logic) => {
        p.conditionGroups[groupIndex].joinWithPrev = logic;
      },
      setInsideLogic: (p, groupIndex: number, logic: Logic) => {
        p.conditionGroups[groupIndex].joinInside = logic;
      },
      setOperator: (
        p,
        groupIndex: number,
        condIndex: number,
        logic: Operator
      ) => {
        const cond = p.conditionGroups[groupIndex].conditions[condIndex];
        cond[1] = logic;
        if (logic === "is-empty") cond[2] = undefined;
      },
    },
  });
}

function joinCondition(
  a: boolean | undefined,
  logic: Logic,
  computeB: () => boolean | undefined
) {
  if (a == null) return computeB();

  switch (logic) {
    case "and": {
      if (a === false) return false;
      const b = computeB();
      if (b == null) return a;
      return a && b;
    }
    case "or": {
      if (a === true) return true;
      const b = computeB();
      if (b == null) return a;
      return a || b;
    }
    case "nor": {
      if (a === true) return false;
      const b = computeB();
      if (b == null) return a;
      return !(a || b);
    }
    default:
      throw new Error(
        `[calculables.condition] Invalid logic operator: ${logic}`
      );
  }
}

function evalCondition(data: Dictionary<any>, cond: ConditionType) {
  const [field, op, value] = cond;
  if (!field || !op) return undefined;

  switch (op) {
    case "==":
      return data[field] == value;
    case "!=":
      return data[field] != value;
    case "is-empty":
      return data[field] == null || data[field] == "";
    default:
      throw new Error(
        `[calculable.condition] Invalid compare operator in [${[
          field,
          op,
          value,
        ]}]`
      );
  }
}
