import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="grid place-items-center h-screen">
      <div className="text-center text-[20px] font-bold">
        <div>Ошибка 404</div>
        <div className="font-normal">
          <span className="mr-10 text-[#B2B3B9]">
            Такой страницы не существует!
          </span>
          <Link
            className="text-[#242EDB] font-semibold underline underline-offset-4"
            to="/"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
