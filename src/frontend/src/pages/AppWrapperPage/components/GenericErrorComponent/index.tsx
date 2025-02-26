import FetchErrorComponent from "@/components/common/fetchErrorComponent";
import TimeoutErrorComponent from "@/components/common/timeoutErrorComponent";
import { useTranslation } from "react-i18next";

export function GenericErrorComponent({ healthCheckTimeout, fetching, retry }) {
  const { t } = useTranslation();
  switch (healthCheckTimeout) {
    case "serverDown":
      return (
        <FetchErrorComponent
          description={t("constants.FETCH_ERROR_DESCRIPION")}
          message={t("constants.FETCH_ERROR_MESSAGE")}
          openModal={true}
          setRetry={retry}
          isLoadingHealth={fetching}
        ></FetchErrorComponent>
      );
    case "timeout":
      return (
        <TimeoutErrorComponent
          description={t("constants.TIMEOUT_ERROR_DESCRIPION")}
          message={t("constants.TIMEOUT_ERROR_MESSAGE")}
          openModal={true}
          setRetry={retry}
          isLoadingHealth={fetching}
        ></TimeoutErrorComponent>
      );
    default:
      return <></>;
  }
}
