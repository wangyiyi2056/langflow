import { useLogout } from "@/controllers/API/queries/auth";
import { CustomFeedbackDialog } from "@/customization/components/custom-feedback-dialog";
import { CustomHeaderMenuItemsTitle } from "@/customization/components/custom-header-menu-items-title";
import { CustomProfileIcon } from "@/customization/components/custom-profile-icon";
import { ENABLE_DATASTAX_LANGFLOW } from "@/customization/feature-flags";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import useAuthStore from "@/stores/authStore";
import { useDarkStore } from "@/stores/darkStore";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  HeaderMenu,
  HeaderMenuItemButton,
  HeaderMenuItemLink,
  HeaderMenuItems,
  HeaderMenuItemsSection,
  HeaderMenuToggle,
} from "../HeaderMenu";
import { ProfileIcon } from "../ProfileIcon";
import ThemeButtons from "../ThemeButtons";
import { useTranslation } from "react-i18next";
export const AccountMenu = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { customParam: id } = useParams();
  const version = useDarkStore((state) => state.version);
  const navigate = useCustomNavigate();
  const { mutate: mutationLogout } = useLogout();
  const { t } = useTranslation();
  const { isAdmin, autoLogin } = useAuthStore((state) => ({
    isAdmin: state.isAdmin,
    autoLogin: state.autoLogin,
  }));

  const handleLogout = () => {
    mutationLogout();
  };

  return (
    <>
      <HeaderMenu>
        <HeaderMenuToggle>
          <div
            className="h-7 w-7 rounded-lg focus-visible:outline-0"
            data-testid="user-profile-settings"
          >
            {ENABLE_DATASTAX_LANGFLOW ? <CustomProfileIcon /> : <ProfileIcon />}
          </div>
        </HeaderMenuToggle>
        <HeaderMenuItems position="right">
          {ENABLE_DATASTAX_LANGFLOW && (
            <HeaderMenuItemsSection>
              <CustomHeaderMenuItemsTitle />
            </HeaderMenuItemsSection>
          )}
          <HeaderMenuItemsSection>
            <div className="flex h-[46px] w-full items-center justify-between px-3">
              <div className="pl-1 text-xs text-zinc-500">
                <span
                  data-testid="menu_version_button"
                  id="menu_version_button"
                >
                  {t("header.VERSION")} {version}
                </span>
              </div>
              {!ENABLE_DATASTAX_LANGFLOW && <ThemeButtons />}
            </div>
              <HeaderMenuItemButton
                icon="arrow-right"
                onClick={() => {
                  navigate("/settings");
                }}
              >
                <span
                  data-testid="menu_settings_button"
                  id="menu_settings_button"
                >
                  {t("header.SETTINGS")}
                </span>
              </HeaderMenuItemButton>
            {!ENABLE_DATASTAX_LANGFLOW && (
              <>
                {isAdmin && !autoLogin && (
                  <HeaderMenuItemButton onClick={() => navigate("/admin")}>
                    <span
                      data-testid="menu_admin_button"
                      id="menu_admin_button"
                    >
                      Admin Page
                    </span>
                  </HeaderMenuItemButton>
                )}
              </>
            )}
              <HeaderMenuItemButton
                icon="arrow-right"
                onClick={() => {
                  navigate("/store");
                }}
              >
                <span
                  data-testid="menu_settings_button"
                  id="menu_settings_button"
                >
                  {t("header.STORE")}
                </span>
              </HeaderMenuItemButton>
              <HeaderMenuItemLink newPage href="https://docs.langflow.org">
                <span data-testid="menu_docs_button" id="menu_docs_button">
                  {t("header.DOCS")}
                </span>
              </HeaderMenuItemLink>
          </HeaderMenuItemsSection>
          {/* <HeaderMenuItemsSection>
              <HeaderMenuItemLink
                newPage
                href="https://github.com/langflow-ai/langflow/discussions"
              >
                <span data-testid="menu_github_button" id="menu_github_button">
                  Share Feedback on Github
                </span>
              </HeaderMenuItemLink>
            <HeaderMenuItemLink newPage href="https://twitter.com/langflow_ai">
              <span data-testid="menu_twitter_button" id="menu_twitter_button">
                Follow Langflow on X
              </span>
            </HeaderMenuItemLink>
            <HeaderMenuItemLink newPage href="https://discord.gg/EqksyE2EX9">
              <span data-testid="menu_discord_button" id="menu_discord_button">
                Join the Langflow Discord
              </span>
            </HeaderMenuItemLink>
          </HeaderMenuItemsSection> */}
          {ENABLE_DATASTAX_LANGFLOW ? (
            <HeaderMenuItemsSection>
              <HeaderMenuItemLink href="/session/logout" icon="log-out">
                Logout
              </HeaderMenuItemLink>
            </HeaderMenuItemsSection>
          ) : (
            !autoLogin && (
              <HeaderMenuItemsSection>
                <HeaderMenuItemButton onClick={handleLogout} icon="log-out">
                  Logout
                </HeaderMenuItemButton>
              </HeaderMenuItemsSection>
            )
          )}
        </HeaderMenuItems>
      </HeaderMenu>
      <CustomFeedbackDialog
        isOpen={isFeedbackOpen}
        setIsOpen={setIsFeedbackOpen}
      />
    </>
  );
};
