import FlowSettingsComponent from "@/components/core/flowSettingsComponent";
import { FlowSettingsPropsType } from "../../types/components";
import BaseModal from "../baseModal";
import { useTranslation } from "react-i18next";

export default function FlowSettingsModal({
  open,
  setOpen,
  flowData,
}: FlowSettingsPropsType): JSX.Element {
  const { t } = useTranslation();
  if (!open) return <></>;
  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      size="small-update"
      className="p-4"
    >
      <BaseModal.Header description={t("constants.SETTINGS_DIALOG_SUBTITLE")}>
        <span className="pr-2">{t("mainPage.DETAILS")}</span>
        <IconComponent name="SquarePen" className="mr-2 h-4 w-4" />
      </BaseModal.Header>
      <BaseModal.Content>
        <FlowSettingsComponent
          flowData={flowData}
          close={() => setOpen(false)}
          open={open}
        />
      </BaseModal.Content>

      <BaseModal.Footer
        submit={{
          label: t("basic.SAVE"),
          dataTestId: "save-flow-settings",
          disabled: disableSave,
          loading: isSaving,
        }}
      />
    </BaseModal>
  );
}
