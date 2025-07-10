import { uniqueId } from "lodash";
import { useContext, useEffect, useState } from "react";
import IconComponent from "../../components/common/genericIconComponent";
import PageLayout from "../../components/common/pageLayout";
import ShadTooltip from "../../components/common/shadTooltipComponent";
import { SkeletonCardComponent } from "../../components/common/skeletonCardComponent";
import { Button } from "../../components/ui/button";

import PaginatorComponent from "@/components/common/paginatorComponent";
import StoreCardComponent from "@/components/common/storeCardComponent";
import { CustomLink } from "@/customization/components/custom-link";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { useUtilityStore } from "@/stores/utilityStore";
import { useParams } from "react-router-dom";
import { TagsSelector } from "../../components/common/tagsSelectorComponent";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  APIKEY_ERROR_ALERT,
  COMPONENTS_ERROR_ALERT,
  INVALID_API_ERROR_ALERT,
  NOAPI_ERROR_ALERT,
} from "../../constants/alerts_constants";
import {
  STORE_PAGINATION_PAGE,
  STORE_PAGINATION_ROWS_COUNT,
  STORE_PAGINATION_SIZE,
} from "../../constants/constants";
import { AuthContext } from "../../contexts/authContext";
import { getStoreComponents } from "../../controllers/API";
import useAlertStore from "../../stores/alertStore";
import useFlowsManagerStore from "../../stores/flowsManagerStore";
import { useStoreStore } from "../../stores/storeStore";
import { storeComponent } from "../../types/store";
import { cn } from "../../utils/utils";
import InputSearchComponent from "../MainPage/components/inputSearchComponent";
import { useTranslation } from "react-i18next";
import { toUpperSnakeCase } from "@/utils/utils";

export default function StorePage(): JSX.Element {
  const hasApiKey = useStoreStore((state) => state.hasApiKey);
  const validApiKey = useStoreStore((state) => state.validApiKey);
  const loadingApiKey = useStoreStore((state) => state.loadingApiKey);
  const setValidApiKey = useStoreStore((state) => state.updateValidApiKey);
  const { t } = useTranslation();
  const { apiKey } = useContext(AuthContext);

  const setErrorData = useAlertStore((state) => state.setErrorData);
  const currentFlowId = useFlowsManagerStore((state) => state.currentFlowId);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [filteredCategories, setFilterCategories] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [searchData, setSearchData] = useState<storeComponent[]>([]);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [pageSize, setPageSize] = useState(STORE_PAGINATION_SIZE);
  const [pageIndex, setPageIndex] = useState(STORE_PAGINATION_PAGE);
  const [pageOrder, setPageOrder] = useState("Popular");
  const [tabActive, setTabActive] = useState("All");
  const [searchNow, setSearchNow] = useState("");
  const [selectFilter, setSelectFilter] = useState("all");

  const tags = useUtilityStore((state) => state.tags);
  const navigate = useCustomNavigate();

  useEffect(() => {
    if (!loadingApiKey) {
      if (!hasApiKey) {
        setErrorData({
          title: APIKEY_ERROR_ALERT,
          list: [NOAPI_ERROR_ALERT],
        });
        setLoading(false);
      } else if (!validApiKey) {
        setErrorData({
          title: APIKEY_ERROR_ALERT,
          list: [INVALID_API_ERROR_ALERT],
        });
      }
    }
  }, [loadingApiKey, validApiKey, hasApiKey, currentFlowId]);

  useEffect(() => {
    handleGetComponents();
  }, [
    tabActive,
    pageOrder,
    pageIndex,
    pageSize,
    filteredCategories,
    selectFilter,
    validApiKey,
    hasApiKey,
    apiKey,
    searchNow,
    loadingApiKey,
    id,
  ]);

  function handleGetComponents() {
    if (loadingApiKey) return;
    setLoading(true);
    getStoreComponents({
      component_id: id,
      page: pageIndex,
      limit: pageSize,
      is_component:
        tabActive === "All" ? null : tabActive === "Flows" ? false : true,
      sort: pageOrder === "Popular" ? "-count(downloads)" : "name",
      tags: filteredCategories,
      liked: selectFilter === "likedbyme" && validApiKey ? true : null,
      isPrivate: null,
      search: inputText === "" ? null : inputText,
      filterByUser: selectFilter === "createdbyme" && validApiKey ? true : null,
    })
      .then((res) => {
        if (!res?.authorized && validApiKey === true) {
          setValidApiKey(false);
          setSelectFilter("all");
        } else {
          if (res?.authorized) {
            setValidApiKey(true);
          }
          setLoading(false);
          setSearchData(res?.results ?? []);
          setTotalRowsCount(
            filteredCategories?.length === 0
              ? Number(res?.count ?? 0)
              : (res?.results?.length ?? 0),
          );
        }
      })
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setValidApiKey(false);
        } else {
          setSearchData([]);
          setTotalRowsCount(0);
          setLoading(false);
          setErrorData({
            title: COMPONENTS_ERROR_ALERT,
            list: [
              err?.response?.data?.detail ??
                "There was an error fetching the components",
            ],
          });
        }
      });
  }

  function resetPagination() {
    setPageIndex(STORE_PAGINATION_PAGE);
    setPageSize(STORE_PAGINATION_SIZE);
  }

  return (
    <PageLayout
      betaIcon
      title={t("constants.STORE_TITLE")}
      description={t("constants.STORE_DESC")}
      button={
        <Button
          data-testid="api-key-button-store"
          disabled={loading}
          className={cn(
            `${!validApiKey ? "animate-pulse border-error" : ""}`,
            loading ? "cursor-not-allowed" : "",
          )}
          variant="primary"
          onClick={() => {
            navigate("/settings/general/api");
          }}
        >
          <IconComponent name="Key" className="mr-2 w-4" />
          {t("storePage.API_KEY")}
        </Button>
      }
    >
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex w-full flex-col gap-4 p-0">
          <div className="flex items-end gap-4">
            <InputSearchComponent
              loading={loading}
              divClasses="relative h-12 w-[40%]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchNow(uniqueId());
                }
              }}
              onClick={() => {
                setSearchNow(uniqueId());
              }}
            />
            <div className="ml-4 flex w-full gap-2 border-b border-border">
              <button
                data-testid="all-button-store"
                disabled={loading}
                onClick={() => {
                  setTabActive("All");
                }}
                className={
                  (tabActive === "All"
                    ? "border-b-2 border-primary p-3"
                    : "border-b-2 border-transparent p-3 text-muted-foreground hover:text-primary") +
                  (loading ? " cursor-not-allowed" : "")
                }
              >
                {t("basic.ALL")}
              </button>
              <button
                data-testid="flows-button-store"
                disabled={loading}
                onClick={() => {
                  resetPagination();
                  setTabActive("Flows");
                }}
                className={
                  (tabActive === "Flows"
                    ? "border-b-2 border-primary p-3"
                    : "border-b-2 border-transparent p-3 text-muted-foreground hover:text-primary") +
                  (loading ? " cursor-not-allowed" : "")
                }
              >
                {t("basic.FLOWS")}
              </button>
              <button
                data-testid="components-button-store"
                disabled={loading}
                onClick={() => {
                  resetPagination();
                  setTabActive("Components");
                }}
                className={
                  (tabActive === "Components"
                    ? "border-b-2 border-primary p-3"
                    : "border-b-2 border-transparent p-3 text-muted-foreground hover:text-primary") +
                  (loading ? " cursor-not-allowed" : "")
                }
              >
                {t("basic.COMPONENTS")}
              </button>
              <ShadTooltip content="Coming Soon">
                <button className="cursor-not-allowed p-3 text-muted-foreground">
                  {t("basic.BUNDLES")}
                </button>
              </ShadTooltip>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              disabled={loading}
              onValueChange={setSelectFilter}
              value={selectFilter}
            >
              <SelectTrigger className="mr-4 w-[160px] flex-shrink-0">
                <SelectValue placeholder="Filter Values" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all"> {t("basic.ALL")}</SelectItem>
                  <SelectItem
                    disabled={!hasApiKey || !validApiKey}
                    value="createdbyme"
                  >
                    {t("storePage.CREATED_BY_ME")}
                  </SelectItem>
                  <SelectItem
                    disabled={!hasApiKey || !validApiKey}
                    value="likedbyme"
                  >
                    {t("storePage.LIKED_BY_ME")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {id === undefined ? (
              <TagsSelector
                tags={(tags ?? []).map(tag => ({
                  ...tag,
                  name: t(`storePage.${toUpperSnakeCase(tag.name)}`, { defaultValue: tag.name })
                }))}
                loadingTags={false}
                disabled={loading}
                selectedTags={filteredCategories}
                setSelectedTags={setFilterCategories}
              />
            ) : (
              <Badge
                key="id"
                variant="outline"
                size="sq"
                className="gap-2 bg-beta-foreground text-background hover:bg-beta-foreground"
              >
                <CustomLink to={"/store"} className="cursor-pointer">
                  <IconComponent name="X" className="h-4 w-4" />
                </CustomLink>
                {id}
              </Badge>
            )}
          </div>
          <div className="flex items-end justify-between">
            <span className="px-0.5 text-sm text-muted-foreground">
              {(!loading || searchData.length !== 0) && (
                <>
                  {totalRowsCount} {totalRowsCount !== 1 ? t("storePage.RESULTS") : t("storePage.RESULT")}
                </>
              )}
            </span>

            <Select
              disabled={loading}
              onValueChange={(e) => {
                setPageOrder(e);
              }}
            >
              <SelectTrigger data-testid="select-order-store">
                <SelectValue placeholder={t("storePage.POPULAR")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Popular">{t("storePage.POPULAR")}</SelectItem>
                {/* <SelectItem value="Recent">Most Recent</SelectItem> */}
                <SelectItem value="Alphabetical">{t("storePage.ALPHABETICAL")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!loading || searchData.length !== 0 ? (
              searchData.map((item) => {
                return (
                  <>
                    <StoreCardComponent
                      key={item.id}
                      data={item}
                      authorized={validApiKey}
                      disabled={loading}
                    />
                  </>
                );
              })
            ) : (
              <>
                <SkeletonCardComponent />
                <SkeletonCardComponent />
                <SkeletonCardComponent />
              </>
            )}
          </div>

          {!loading && searchData?.length === 0 && (
            <div className="mt-6 flex w-full items-center justify-center text-center">
              <div className="flex h-full w-full flex-col">
                <div className="flex w-full flex-col gap-4">
                  <div className="grid w-full gap-4">
                    {selectFilter != "all" ? (
                      <>
                        You haven't{" "}
                        {selectFilter === "createdbyme" ? "created" : "liked"}{" "}
                        anything with the selected filters yet.
                      </>
                    ) : (
                      <>
                        {tabActive == "Flows" ? t("constants.NO_FLOWS_WITH_SELECTED_FILTERS") : t("constants.NO_COMPONENTS_WITH_SELECTED_FILTERS")}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {!loading && searchData.length > 0 && (
          <div className="relative py-6">
            <PaginatorComponent
              pageIndex={pageIndex}
              pageSize={pageSize}
              rowsCount={STORE_PAGINATION_ROWS_COUNT}
              totalRowsCount={totalRowsCount}
              paginate={(pageIndex, pageSize) => {
                setPageIndex(pageIndex);
                setPageSize(pageSize);
              }}
            ></PaginatorComponent>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
