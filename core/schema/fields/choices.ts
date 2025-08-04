import { insertArrayPosition } from "../../helpers.ts";
import { InsertArrayPosition } from "../types.ts";

export interface GenericChoice<V = string | number> {
  /** choice value */
  value: V;
  /** optional. Label can be set different from value */
  label?: string;
  /** optinal image uri strings */
  images?: string[];
}

export type GenericChoiceParam = {
  choices: GenericChoice[];
};

export const genericChoiceParamReducer = {
  addChoice(
    p: GenericChoiceParam,
    choice: GenericChoice,
    position: InsertArrayPosition = ["last"]
  ) {
    if (p.choices.some((s) => s.value === choice.value)) {
      console.warn("Options must be different from each after");
      return;
    }
    p.choices = insertArrayPosition(p.choices, position, choice);
  },
  removeChoice(p: GenericChoiceParam, index: number) {
    p.choices.splice(index, 1);
  },
  setChoice(p: GenericChoiceParam, choice: GenericChoice, choiceIndex: number) {
    p.choices[choiceIndex] = choice;
  },
  addImage(
    p: GenericChoiceParam,
    choiceIndex: number | undefined | null,
    uri: string
  ) {
    if (choiceIndex == null) {
      // add new choice and set default option value
      let nextIndexValue = p.choices.length + 1;
      while (
        p.choices.some((c) => c.value === `Option ${p.choices.length + 1}`)
      ) {
        nextIndexValue += 1;
      }
      const newChoice: GenericChoice = {
        value: `Option ${nextIndexValue}`,
        images: [uri],
      };
      p.choices.push(newChoice);
    } else {
      const c = p.choices[choiceIndex];
      if (!c) {
        console.warn(`choice index ${choiceIndex} does not exist. Ignored.`);
        return;
      }
      if (!c.images) c.images = [];
      c.images.push(uri);
    }
  },
  removeImage(p: GenericChoiceParam, choiceIndex: number, imageIndex: number) {
    if (!p.choices[choiceIndex]) {
      console.warn(
        `Got index choice: ${choiceIndex}, image: ${imageIndex} but no images to removed. Ignored`
      );
      return;
    }
    p.choices[choiceIndex].images?.splice(imageIndex, 1);
  },
};
