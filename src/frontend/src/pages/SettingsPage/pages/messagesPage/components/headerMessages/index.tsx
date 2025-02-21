import ForwardedIconComponent from "../../../../../../components/common/genericIconComponent";
import { useTranslation } from "react-i18next";

const HeaderMessagesComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex w-full items-center justify-between gap-4 space-y-0.5">
        <div className="flex w-full flex-col">
          <h2 className="flex items-center text-lg font-semibold tracking-tight">
            {t("settingsPage.messages")}
            <ForwardedIconComponent
              name="MessagesSquare"
              className="ml-2 h-5 w-5 text-primary"
            />
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("settingsPage.MESSAGES_DSC")}
          </p>
        </div>
      </div>
    </>
  );
};
export default HeaderMessagesComponent;
