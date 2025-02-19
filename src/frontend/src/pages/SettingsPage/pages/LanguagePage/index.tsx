import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import i18n from "@/locales/i18n";

const LanguagePage = () => {
  // 初始化时优先读取本地存储，没有则使用系统语言
  const [currentLang, setCurrentLang] = useState<string>(
    localStorage.getItem('lang') || 'system'
  );

  // 处理语言切换
  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
    localStorage.setItem('lang', newLang);
    
    // 应用语言设置
    if (newLang === 'system') {
      const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      i18n.changeLanguage(systemLang);
    } else {
      i18n.changeLanguage(newLang);
    }
  };

  // 可用语言选项（可扩展）
  const languageOptions = [
    { value: 'system', label: '跟随系统' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ];

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex w-full items-start gap-6">
        <div className="flex w-full flex-col">
          <h2 className="flex items-center text-lg font-semibold tracking-tight">
            Language
            <ForwardedIconComponent
              name="Languages"
              className="ml-2 h-5 w-5 text-primary"
            />
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage the language settings for Langflow.
          </p>
        </div>
      </div>
      <Form.Root
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Card x-chunk="dashboard-04-chunk-2" id="api">
          <CardHeader>
            <CardTitle>Interface language</CardTitle> 
          </CardHeader>
          <CardContent>
          <Select
              onValueChange={handleLanguageChange}
              value={currentLang}
            >
              <SelectTrigger className="mr-4 w-[160px] flex-shrink-0">
                <SelectValue placeholder="Filter Values" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </Form.Root>
    </div>
  );
};

export default LanguagePage;