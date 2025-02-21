import { CustomLink } from "@/customization/components/custom-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { useTranslation } from "react-i18next";
import { toUpperSnakeCase } from "@/utils/utils";

type SideBarButtonsComponentProps = {
  items: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[];
  handleOpenNewFolderModal?: () => void;
};

const SideBarButtonsComponent = ({ items }: SideBarButtonsComponentProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} className="border-none">
      <SidebarContent className="pr-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <CustomLink to={item.href!}>
                    <SidebarMenuButton
                      size="md"
                      isActive={
                        item.href ? pathname.endsWith(item.href) : false
                      }
                      data-testid={`sidebar-nav-${item.title}`}
                      tooltip={t(`settingsPage.${toUpperSnakeCase(item.title)}`)}
                    >
                      {item.icon}
                      <span className="block max-w-full truncate">
                        {t(`settingsPage.${toUpperSnakeCase(item.title)}`)}
                      </span>
                    </SidebarMenuButton>
                  </CustomLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBarButtonsComponent;
