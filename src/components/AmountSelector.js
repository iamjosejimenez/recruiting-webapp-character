import React from "react";
import "./AmountSelector.css";

const AmountSelector = ({ title, value, onClickAdd, onClickSubtract }) => {
  return (
    <div className="AmountSelector-button-container">
      <span>{title}: </span>
      <span>{value}</span>
      <button onClick={onClickAdd}>+</button>
      <button onClick={onClickSubtract}>-</button>
    </div>
  );
};

export default AmountSelector;
