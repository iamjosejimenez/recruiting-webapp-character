import { useState, useEffect } from "react";
import "./App.css";
import {
  ATTRIBUTE_LIST,
  CLASS_LIST,
  DEFAULT_ATTRIBUTES_AMOUNT,
  DEFAULT_SKILLS_TOTAL,
  SKILL_LIST,
} from "./consts.js";
import AmountSelector from "./components/AmountSelector";
import { calculateModifier } from "./utils";

function App() {
  const [characterSheet, setCharacterSheet] = useState({
    attributes: {},
    classes: {},
    skills: {},
  });

  useEffect(() => {
    const attributes = {};
    ATTRIBUTE_LIST.forEach((attribute) => {
      attributes[attribute] = {
        amount: DEFAULT_ATTRIBUTES_AMOUNT,
        modifier: 0,
      };
    });

    const classes = {};
    Object.keys(CLASS_LIST).forEach((classConstant) => {
      classes[classConstant] = { isOpen: false };
    });

    const skills = {};

    SKILL_LIST.forEach(({ name, ...rest }) => {
      skills[name] = {
        amount: 0,
        ...rest,
      };
    });

    setCharacterSheet((previousCharacterSheet) => ({
      ...previousCharacterSheet,
      attributes,
      classes,
      skills,
      skillsAmountTotal: DEFAULT_SKILLS_TOTAL,
    }));
  }, []);

  const handleUpdateAttribute = (event, attribute, operation) => {
    event.preventDefault();
    setCharacterSheet((previousCharacterSheet) => {
      let attributeAmount = previousCharacterSheet.attributes[attribute].amount;

      if (operation === "SUM") {
        attributeAmount += 1;
      } else {
        attributeAmount -= 1;
      }

      const attributeModifier = calculateModifier(attributeAmount);

      let skillsAmountTotal = previousCharacterSheet.skillsAmountTotal;
      if (attribute === "Intelligence") {
        skillsAmountTotal = DEFAULT_SKILLS_TOTAL + 4 * attributeModifier;
      }

      return {
        ...previousCharacterSheet,
        skillsAmountTotal,
        attributes: {
          ...previousCharacterSheet.attributes,
          [attribute]: {
            ...previousCharacterSheet.attributes[attribute],
            amount: attributeAmount,
            modifier: attributeModifier,
          },
        },
      };
    });
  };

  const checkValidClass = (classConstant) => {
    let isValidClass = true;
    Object.entries(CLASS_LIST[classConstant]).forEach(
      ([attribute, minAmount]) => {
        const attributeAmount = characterSheet.attributes[attribute].amount;
        isValidClass = isValidClass && attributeAmount >= minAmount;
      }
    );

    return isValidClass;
  };

  const onClickClassHandler = (event, classConstant) => {
    event.preventDefault();
    setCharacterSheet((previousCharacterSheet) => {
      const newClassIsOpen =
        !previousCharacterSheet.classes[classConstant].isOpen;

      return {
        ...previousCharacterSheet,
        classes: {
          ...previousCharacterSheet.classes,
          [classConstant]: {
            ...previousCharacterSheet.classes[classConstant],
            isOpen: newClassIsOpen,
          },
        },
      };
    });
  };

  const handleUpdateSkill = (event, skill, operation) => {
    event.preventDefault();
    setCharacterSheet((previousCharacterSheet) => {
      let skillAmount = previousCharacterSheet.skills[skill].amount;

      if (operation === "SUM") {
        skillAmount += 1;
      } else {
        skillAmount -= 1;
      }

      return {
        ...previousCharacterSheet,
        skills: {
          ...previousCharacterSheet.skills,
          [skill]: {
            ...previousCharacterSheet.skills[skill],
            amount: skillAmount,
          },
        },
      };
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          <h2>Attributes</h2>
          {Object.entries(characterSheet.attributes).map(
            ([attribute, { amount, modifier }]) => (
              <div
                className="App-Attributes-Container"
                key={`container${attribute}`}
              >
                <AmountSelector
                  key={attribute}
                  title={attribute}
                  value={amount}
                  onClickAdd={(event) =>
                    handleUpdateAttribute(event, attribute, "SUM")
                  }
                  onClickSubtract={(event) =>
                    handleUpdateAttribute(event, attribute, "SUBTRACT")
                  }
                />
                <div key={`modifier${attribute}`}>Modifier: ({modifier})</div>
              </div>
            )
          )}
        </div>
        <div className="App-Classes-Container">
          <h2>Classes</h2>
          {
            <ul>
              {Object.entries(characterSheet.classes).map(
                ([classConstant, { isOpen }]) => (
                  <li
                    key={classConstant}
                    className={
                      checkValidClass(classConstant) ? "Is-Active-Class" : ""
                    }
                  >
                    <div
                      onClick={(event) =>
                        onClickClassHandler(event, classConstant)
                      }
                    >
                      {classConstant}
                    </div>
                    {isOpen &&
                      Object.entries(CLASS_LIST[classConstant]).map(
                        ([attributeClass, minAmount]) => (
                          <div key={`${classConstant}${attributeClass}`}>
                            {attributeClass}: {minAmount}
                          </div>
                        )
                      )}
                  </li>
                )
              )}
            </ul>
          }
        </div>
        <div>
          <h2>Skills</h2>
          <h3>Total Available: {characterSheet.skillsAmountTotal}</h3>
          <div>
            {Object.entries(characterSheet.skills).map(
              ([skill, { amount, attributeModifier }]) => (
                <div className="App-Skills-Container" key={`container${skill}`}>
                  <AmountSelector
                    key={skill}
                    title={skill}
                    value={amount}
                    onClickAdd={(event) =>
                      handleUpdateSkill(event, skill, "SUM")
                    }
                    onClickSubtract={(event) => {
                      handleUpdateSkill(event, skill, "SUBTRACT");
                    }}
                  />
                  <div key={`modifier${skill}`}>
                    Modifier: {attributeModifier} (
                    {characterSheet.attributes[attributeModifier].modifier})
                  </div>
                  <div key={`total${skill}`}>
                    Total:{" "}
                    {characterSheet.attributes[attributeModifier].modifier +
                      amount}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
