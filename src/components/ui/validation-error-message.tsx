import React from "react";

const ValidationErrorMessage = ({ message}: { message: string }) => {
  return <p className="text-xs text-destructive">{message}</p>;
};

export default ValidationErrorMessage;

