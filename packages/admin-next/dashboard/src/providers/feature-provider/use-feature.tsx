import { useContext } from "react";
import { FeatureContext } from "./feature-context";

export const useFeature = () => {
  const context = useContext(FeatureContext);
  if (context === null) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }
  return context;
};
