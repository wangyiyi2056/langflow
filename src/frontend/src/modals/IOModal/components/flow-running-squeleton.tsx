import { TextShimmer } from "@/components/ui/TextShimmer";
import LogoIcon from "./chatView/chatMessage/components/chat-logo-icon";
import { useTranslation } from "react-i18next";
export default function FlowRunningSqueleton() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full gap-4 rounded-md p-2">
      <LogoIcon />
      <div className="flex items-center">
        <div>
          <TextShimmer className="" duration={1}>
            {t("flowPage.FLOW_RUNNING")}
          </TextShimmer>
        </div>
      </div>
    </div>
  );
}
