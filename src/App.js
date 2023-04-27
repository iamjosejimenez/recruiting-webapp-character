import { useState, useEffect } from "react";
import "./App.css";
import {
  ATTRIBUTE_LIST,
  CLASS_LIST,
  DEFAULT_ATTRIBUTES_AMOUNT,
  SKILL_LIST,
} from "./consts.js";
import AmountSelector from "./components/AmountSelector";
import { calculateModifier } from "./utils";

function App() {
  const [characterSheet, setCharacterSheet] = useState({
    attributes: {},
    classes: {},
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

    setCharacterSheet((previousCharacterSheet) => ({
      ...previousCharacterSheet,
      attributes,
      classes,
    }));
  }, []);

  const handleUpdateAttribute = (event, attribute, operation) => {
    event.preventDefault();
    setCharacterSheet((previousCharacterSheet) => {
      let newAttributeAmount =
        previousCharacterSheet.attributes[attribute].amount;

      if (operation === "SUM") {
        newAttributeAmount += 1;
      } else {
        newAttributeAmount -= 1;
      }

      return {
        ...previousCharacterSheet,
        attributes: {
          ...previousCharacterSheet.attributes,
          [attribute]: {
            ...previousCharacterSheet.attributes[attribute],
            amount: newAttributeAmount,
            modifier: calculateModifier(newAttributeAmount),
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          {Object.entries(characterSheet.attributes).map(
            ([attribute, { amount, modifier }]) => (
              <div className="App-Attributes-Container">
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
                <div>Modifier: ({modifier})</div>
              </div>
            )
          )}
        </div>
        <div className="App-Classes-Container">
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
      </section>
    </div>
  );
}

export default App;
