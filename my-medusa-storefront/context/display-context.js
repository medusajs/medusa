import React, { useReducer } from "react";

export const defaultDisplayContext = {
  cartView: false,
  orderSummary: false,
  checkoutStep: 1,
  updateCartViewDisplay: () => {},
  updateOrderSummaryDisplay: () => {},
  updateCheckoutStep: () => {},
  dispatch: () => {},
};

const DisplayContext = React.createContext(defaultDisplayContext);
export default DisplayContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "updateCartViewDisplay":
      return { ...state, cartView: !state.cartView };
    case "updateOrderSummaryDisplay":
      return { ...state, orderSummary: !state.orderSummary };
    case "updateCheckoutStep":
      return { ...state, checkoutStep: action.payload };
    default:
      return state;
  }
};

export const DisplayProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultDisplayContext);

  const updateCartViewDisplay = () => {
    dispatch({ type: "updateCartViewDisplay" });
  };

  const updateOrderSummaryDisplay = () => {
    dispatch({ type: "updateOrderSummaryDisplay" });
  };

  const updateCheckoutStep = (step) => {
    dispatch({ type: "updateCheckoutStep", payload: step });
  };

  return (
    <DisplayContext.Provider
      value={{
        ...state,
        updateCartViewDisplay,
        updateOrderSummaryDisplay,
        updateCheckoutStep,
        dispatch,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
};
