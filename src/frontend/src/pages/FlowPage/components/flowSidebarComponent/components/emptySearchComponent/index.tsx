import { useTranslation } from "react-i18next";


const NoResultsMessage = ({
  onClearSearch,
  message = "EMPTY_SEARCH_COMPONENT",
  clearSearchText = "CLEAR_SEARCH",
  additionalText = "ADDITIONAL_TEXT",
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center p-3 text-center">
      <p className="text-sm text-secondary-foreground">
        {t(`messages.${message}`,{ defaultValue: message })}{" "}
        <a
          className="cursor-pointer underline underline-offset-4"
          onClick={onClearSearch}
        >
          {t(`messages.${clearSearchText}`,{ defaultValue: clearSearchText })}
        </a>{" "}
        {t(`messages.${additionalText}`,{ defaultValue: additionalText })}
      </p>
    </div>
  );
};

export default NoResultsMessage;
