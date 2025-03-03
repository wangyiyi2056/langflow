import ForwardedIconComponent from "@/components/common/genericIconComponent";
import Loading from "@/components/ui/loading";
import { truncate } from "lodash";
import { useState } from "react";
import ConfirmationModal from "../confirmationModal";
import { useTranslation } from "react-i18next";

export function SaveChangesModal({
  onSave,
  onProceed,
  onCancel,
  flowName,
  lastSaved,
  autoSave,
}: {
  onSave: () => void;
  onProceed: () => void;
  onCancel: () => void;
  flowName: string;
  lastSaved: string | undefined;
  autoSave: boolean;
}): JSX.Element {
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();
  return (
    <ConfirmationModal
      open={true}
      onClose={onCancel}
      destructiveCancel
      title={
        (autoSave ? t("basic.FLOW") : truncate(flowName, { length: 32 })) +
        " " +
        t("flowPage.HAS_UNSAVED_CHANGES")
      }
      cancelText={autoSave ? undefined : t("flowPage.EXIT_ANYWAY")}
      confirmationText={autoSave ? undefined : t("flowPage.SAVE_AND_EXIT")}
      onConfirm={
        autoSave
          ? undefined
          : () => {
              setSaving(true);
              onSave();
            }
      }
      onCancel={onProceed}
      loading={autoSave ? true : saving}
      size="x-small"
    >
      <ConfirmationModal.Content>
        {autoSave ? (
          <div className="mb-4 flex w-full items-center gap-3 rounded-md bg-muted px-4 py-2 text-muted-foreground">
            <Loading className="h-5 w-5" />
            {t("flowPage.SAVING_YOUR_CHANGES")}
          </div>
        ) : (
          <>
            <div className="mb-4 flex w-full items-center gap-3 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100">
              <ForwardedIconComponent name="Info" className="h-5 w-5" />
              Last saved: {lastSaved ?? "Never"}
            </div>
            Unsaved changes will be permanently lost.{" "}
            <a
              target="_blank"
              className="underline"
              href="https://docs.langflow.org/configuration-auto-save"
            >
              Enable auto-saving
            </a>{" "}
            to avoid losing progress.
          </>
        )}
      </ConfirmationModal.Content>
    </ConfirmationModal>
  );
}
