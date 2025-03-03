import { convertTestName } from "@/components/common/storeCardComponent/utils/convert-test-name";
import { Badge } from "@/components/ui/badge";
import { nodeColorsName } from "@/utils/styleUtils";
import { useTranslation } from "react-i18next";

export default function HandleTooltipComponent({
  isInput,
  tooltipTitle,
  isConnecting,
  isCompatible,
  isSameNode,
  left,
}: {
  isInput: boolean;
  tooltipTitle: string;
  isConnecting: boolean;
  isCompatible: boolean;
  isSameNode: boolean;
  left: boolean;
}) {
  const { t } = useTranslation();
  const tooltips = tooltipTitle.split("\n");
  return (
    <div className="font-medium">
      {isSameNode ? (
        t("flowPage.SAME_NODE")
      ) : (
        <div className="flex items-center gap-1.5">
          {isConnecting ? (
            isCompatible ? (
              <span>
                <span className="font-semibold">Connect</span> to
              </span>
            ) : (
              <span>{t("flowPage.INCOMPATIBLE_WITH")}</span>
            )
          ) : (
            <span className="text-xs">
              {isInput
                ? `${t("flowPage.categories.INPUTS")} ${t("flowPage.categories.TYPE")}`
                : `${t("flowPage.categories.OUTPUTS")} ${t("flowPage.categories.TYPE")}`}
              :{" "}
            </span>
          )}
          {tooltips.map((word, index) => (
            <Badge
              className="h-6 rounded-md p-1"
              key={`${index}-${word.toLowerCase()}`}
              style={{
                backgroundColor: left
                  ? `hsl(var(--datatype-${nodeColorsName[word]}))`
                  : `hsl(var(--datatype-${nodeColorsName[word]}-foreground))`,
                color: left
                  ? `hsl(var(--datatype-${nodeColorsName[word]}-foreground))`
                  : `hsl(var(--datatype-${nodeColorsName[word]}))`,
              }}
              data-testid={`${isInput ? "input" : "output"}-tooltip-${convertTestName(word)}`}
            >
              {word}
            </Badge>
          ))}
          {isConnecting && <span>{isInput ? `${t("flowPage.categories.INPUTS")}` : `${t("flowPage.categories.OUTPUTS")}`}</span>}
        </div>
      )}
      {!isConnecting && (
        <div className="mt-2 flex flex-col gap-0.5 text-xs leading-6">
          <div>
            <b>{t("flowPage.DRAG")}</b> {t("flowPage.TO_CONNECT_COMPATIBLE")} {!isInput ? `${t("flowPage.categories.INPUTS")}` : `${t("flowPage.categories.OUTPUTS")}`}
          </div>
          <div>
            <b>{t("flowPage.CLICK")}</b> {t("flowPage.TO_FILTER_COMPATIBLE")} {!isInput ? `${t("flowPage.categories.INPUTS")}` : `${t("flowPage.categories.OUTPUTS")}`}
            {t("flowPage.AND_COMPONENTS")}
          </div>
        </div>
      )}
    </div>
  );
}
