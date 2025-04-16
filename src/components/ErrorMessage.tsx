import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorMessageProps {
  error: Error | null;
  translationKey?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  translationKey,
}) => {
  const { t } = useTranslation();

  if (!error) return null;

  const errorMessage = translationKey ? t(translationKey) : error?.message;

  return (
    <div>
      <span>error</span>
      <span>{errorMessage}</span>
    </div>
  );
};
