import ForwardedIconComponent from "@/components/common/genericIconComponent";
import useDragStart from "@/components/core/cardComponent/hooks/use-on-drag-start";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useDeleteFlow from "@/hooks/flows/use-delete-flow";
import DeleteConfirmationModal from "@/modals/deleteConfirmationModal";
import FlowSettingsModal from "@/modals/flowSettingsModal";
import useAlertStore from "@/stores/alertStore";
import useFlowsManagerStore from "@/stores/flowsManagerStore";
import { FlowType } from "@/types/flow";
import { swatchColors } from "@/utils/styleUtils";
import { cn, getNumberFromString } from "@/utils/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useDescriptionModal from "../../hooks/use-description-modal";
import { useGetTemplateStyle } from "../../utils/get-template-style";
import { timeElapsed } from "../../utils/time-elapse";
import DropdownComponent from "../dropdown";
import { useTranslation } from "react-i18next";
import {toUpperSnakeCase} from "@/utils/utils";
import { TFunction } from "i18next";


// 新增翻译处理函数
const getTranslatedName = (name: string, t: TFunction, isDescription = false) => {
  return name.replace(/^([^\d\(\s]+.*?)(\s*[\(\d].*)?$/, (_, basePart, numberPart) => {
    // 生成翻译键并尝试翻译
    const snakeKey = toUpperSnakeCase(basePart.trim());
    // 根据是否是描述选择不同的翻译路径
    const translationPath = isDescription 
      ? `mainPage.templates.flow.${snakeKey}_DSC`
      : `mainPage.templates.flow.${snakeKey}`;
    const translated = t(translationPath);
    
    // 判断是否翻译成功（翻译结果不等于键名时才视为成功）
    const isTranslated = translated !== translationPath;
    
    // 未翻译成功时保留原始名称的base部分
    const displayBase = isTranslated ? translated : basePart.trim();
    
    return displayBase + (numberPart ? ` ${numberPart.trim()}` : '');
  });
};

const GridComponent = ({ flowData }: { flowData: FlowType }) => {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const { deleteFlow } = useDeleteFlow();

  const setErrorData = useAlertStore((state) => state.setErrorData);
  const { folderId } = useParams();
  const isComponent = flowData.is_component ?? false;
  const setFlowToCanvas = useFlowsManagerStore(
    (state) => state.setFlowToCanvas,
  );

  const { getIcon } = useGetTemplateStyle(flowData);

  const editFlowLink = `/flow/${flowData.id}${folderId ? `/folder/${folderId}` : ""}`;

  const handleClick = async () => {
    if (!isComponent) {
      await setFlowToCanvas(flowData);
      navigate(editFlowLink);
    }
  };

  const handleDelete = () => {
    deleteFlow({ id: [flowData.id] })
      .then(() => {
        setSuccessData({
          title: "Selected items deleted successfully",
        });
      })
      .catch(() => {
        setErrorData({
          title: "Error deleting items",
          list: ["Please try again"],
        });
      });
  };

  const descriptionModal = useDescriptionModal(
    [flowData?.id],
    flowData.is_component ? "component" : "flow",
  );

  const { onDragStart } = useDragStart(flowData);

  const swatchIndex =
    (flowData.gradient && !isNaN(parseInt(flowData.gradient))
      ? parseInt(flowData.gradient)
      : getNumberFromString(flowData.gradient ?? flowData.id)) %
    swatchColors.length;

  return (
    <>
      <Card
        key={flowData.id}
        draggable
        onDragStart={onDragStart}
        onClick={handleClick}
        className={`my-1 flex flex-col rounded-lg border border-border bg-background p-4 hover:border-placeholder-foreground hover:shadow-sm ${
          isComponent ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <div className="flex w-full items-center gap-4">
          <div className={cn(`flex rounded-lg p-3`, swatchColors[swatchIndex])}>
            <ForwardedIconComponent
              name={getIcon()}
              aria-hidden="true"
              className="h-5 w-5"
            />
          </div>
          <div className="flex w-full min-w-0 items-center justify-between">
            <div className="flex min-w-0 flex-col">
              <div className="text-md truncate font-semibold">
                {getTranslatedName(flowData.name, t)}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {t("mainPage.EDITED")} {timeElapsed(flowData.updated_at)} {t("mainPage.time.AGO")}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  data-testid="home-dropdown-menu"
                  size="iconMd"
                  className="group"
                >
                  <ForwardedIconComponent
                    name="Ellipsis"
                    aria-hidden="true"
                    className="h-5 w-5 text-muted-foreground group-hover:text-foreground"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[185px]"
                sideOffset={5}
                side="bottom"
              >
                <DropdownComponent
                  flowData={flowData}
                  setOpenDelete={setOpenDelete}
                  handleEdit={() => {
                    setOpenSettings(true);
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="line-clamp-2 h-full pt-5 text-sm text-primary">
          {getTranslatedName(flowData.name, t, true)}
        </div>
      </Card>

      {openDelete && (
        <DeleteConfirmationModal
          open={openDelete}
          setOpen={setOpenDelete}
          onConfirm={handleDelete}
          description={descriptionModal}
          note={
            !flowData.is_component
              ? t("messages.DELETE_FLOW_MSG")
              : ""
          }
        >
          <></>
        </DeleteConfirmationModal>
      )}
      <FlowSettingsModal
        open={openSettings}
        setOpen={setOpenSettings}
        flowData={flowData}
        details
      />
    </>
  );
};

export default GridComponent;
