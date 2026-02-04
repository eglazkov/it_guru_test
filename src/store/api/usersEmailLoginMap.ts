// Поскольку API работает только с логинами, а не емейлами,
// будем брать соответвующий лоигн, по ключу

const userEmailList: Record<string, string> = {
  "emily.johnson@x.dummyjson.com": "emilys",
};

export const getUserLoginByEmail = (email: string) => {
  return userEmailList[email] || email;
};
