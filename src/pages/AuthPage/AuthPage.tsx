import { type FC } from "react";

import { Input, CheckBox, Button, Logo } from "../../components";
import type { AuthData } from "../../hooks/useAuth";

interface AuthPageProps {
  data: AuthData;
}

const AuthPage: FC<AuthPageProps> = ({ data }) => {
  return (
    <div className="w-screen h-screen grid place-items-center drop-shadow-[0_24px_32px_rgba(0,0,0,0.04)]">
      <div className="p-6 rounded-[40px] bg-[#FFFFFF] text-center">
        <div
          className="flex flex-col px-65 py-48 rounded-[34px] bg-linear-to-b
         from-[#232323]/3 from-0% to-[#232323]/0 to-50% items-center"
        >
          <Logo />
          <form
            className="mb-16"
            onSubmit={(e) => {
              e.preventDefault();
              data.onSubmit();
            }}
          >
            <div className="text-[40px] font-semibold mb-12">
              Добро пожаловать!
            </div>
            <div
              className="text-[18px] bg-linear-to-b from-[#000000]/30 from-0%
            to-[#000000]/10 to-100% bg-clip-text text-transparent mb-32"
            >
              Пожалуйста, авторизируйтесь
            </div>
            <div>
              <Input
                className="mb-16"
                id="email"
                label="Почта"
                placeholder="Введите почту"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => data.onEmailChange(e.target.value)}
              />
              <Input
                className="mb-20"
                id="password"
                label="Пароль"
                placeholder="Введите пароль"
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => data.onPasswordChange(e.target.value)}
              />
              <CheckBox
                className="mb-20"
                id="remindme"
                label="Запомнить данные"
                name="remindme"
                checked={data.isRemind}
                onChange={(e) => data.onRemindChange(e.target.checked)}
              />
              <Button type="submit">Войти</Button>
            </div>
          </form>
          <div className="flex w-full flex-row items-center gap-10 mb-32">
            <div className="w-full h-1 bg-[#EDEDED]"></div>
            <span
              className="text-[16px] bg-linear-to-b from-[#000000]/30 from-0%
            to-[#000000]/10 to-100% bg-clip-text text-transparent"
            >
              или
            </span>
            <div className="w-full h-1 bg-[#EDEDED]"></div>
          </div>
          <div className="text-[18px] text-[#6C6C6C]">
            Нет аккаунта?{" "}
            <a
              href="#"
              className="text-[#242EDB] font-semibold underline underline-offset-4"
            >
              Создать
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
