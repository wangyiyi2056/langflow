import * as Form from "@radix-ui/react-form";
import InputComponent from "../../../../../components/core/parameterRenderComponent/components/inputComponent";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  CREATE_API_KEY,
  INSERT_API_KEY,
  INVALID_API_KEY,
  NO_API_KEY,
} from "../../../../../constants/constants";
import { useTranslation } from "react-i18next";

type StoreApiKeyFormComponentProps = {
  apikey: string;
  handleInput: (event: any) => void;
  handleSaveKey: (apikey: string, handleInput: any) => void;
  loadingApiKey: boolean;
  validApiKey: boolean;
  hasApiKey: boolean;
};
const StoreApiKeyFormComponent = ({
  apikey,
  handleInput,
  handleSaveKey,
  loadingApiKey,
  validApiKey,
  hasApiKey,
}: StoreApiKeyFormComponentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Root
        onSubmit={(event) => {
          event.preventDefault();
          handleSaveKey(apikey, handleInput);
        }}
      >
        <Card x-chunk="dashboard-04-chunk-2" id="api">
          <CardHeader>
            <CardTitle>{t("settingsPage.LANGFLOW_STORE_API_KEY")}</CardTitle>
            <CardDescription>
              {(hasApiKey && !validApiKey
                ? t("constants.INVALID_API_KEY")
                : !hasApiKey
                  ? t("constants.NO_API_KEY")
                  : "") + t("constants.INSERT_API_KEY")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full gap-4">
                <Form.Field name="apikey" className="w-full">
                  <InputComponent
                    id="apikey"
                    onChange={(value) => {
                      handleInput({ target: { name: "apikey", value } });
                    }}
                    value={apikey}
                    isForm
                    password={true}
                    placeholder={t("settingsPage.LANGFLOW_STORE_INPUT_PLACEHOLDER")}
                    className="w-full"
                  />
                  <Form.Message match="valueMissing" className="field-invalid">
                    {t("settingsPage.LANGFLOW_STORE_INPUT_PLACEHOLDER")}
                  </Form.Message>
                </Form.Field>
              </div>
              <span className="pr-1 text-xs text-muted-foreground">
                {t("constants.CREATE_API_KEY")}{" "}
                <a
                  className="text-high-indigo underline"
                  href="https://langflow.store/"
                  target="_blank"
                >
                  {t("constants.LANGFLOW_STORE")}
                </a>
              </span>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Form.Submit asChild>
              <Button
                loading={loadingApiKey}
                type="submit"
                data-testid="api-key-save-button-store"
              >
                {t("basic.SAVE")}
              </Button>
            </Form.Submit>
          </CardFooter>
        </Card>
      </Form.Root>
    </>
  );
};
export default StoreApiKeyFormComponent;
