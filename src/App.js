import { useState, useEffect } from "react";
import "./App.css";
import {
  ATTRIBUTE_LIST,
  CLASS_LIST,
  DEFAULT_ATTRIBUTES_AMOUNT,
  SKILL_LIST,
} from "./consts.js";
import AmountSelector from "./components/AmountSelector";

function App() {
  const [num, setNum] = useState(0);
  const [characterSheet, setCharacterSheet] = useState({ attributes: {} });

  useEffect(() => {
    const attributes = {};
    ATTRIBUTE_LIST.forEach((attribute) => {
      attributes[attribute] = { amount: DEFAULT_ATTRIBUTES_AMOUNT };
    });

    setCharacterSheet((previousCharacterSheet) => ({
      ...previousCharacterSheet,
      attributes,
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
            ([attribute, { amount }]) => (
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
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
