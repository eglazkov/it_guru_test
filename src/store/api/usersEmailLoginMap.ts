// Поскольку API работает только с логинами, а не емейлами,
// будем брать соответвующий лоигн, по ключу

const userEmailList: Record<string, string> = {
  "emily.johnson@x.dummyjson.com": "emilys",
  "michael.williams@x.dummyjson.com": "michaelw",
  "sophia.brown@x.dummyjson.com": "sophiab",
  "james.davis@x.dummyjson.com": "jamesd",
  "emma.miller@x.dummyjson.com": "emmaj",
  "olivia.wilson@x.dummyjson.com": "oliviaw",
  "alexander.jones@x.dummyjson.com": "alexanderj",
  "ava.taylor@x.dummyjson.com": "avat",
  "ethan.martinez@x.dummyjson.com": "ethanm",
  "isabella.anderson@x.dummyjson.com": "isabellad",
  "liam.garcia@x.dummyjson.com": "liamg",
  "mia.rodriguez@x.dummyjson.com": "miar",
  "noah.hernandez@x.dummyjson.com": "noahh",
  "charlotte.lopez@x.dummyjson.com": "charlottem",
  "william.gonzalez@x.dummyjson.com": "williamg",
  "avery.perez@x.dummyjson.com": "averyp",
  "evelyn.sanchez@x.dummyjson.com": "evelyns",
  "logan.torres@x.dummyjson.com": "logant",
  "abigail.rivera@x.dummyjson.com": "abigailr",
  "jackson.evans@x.dummyjson.com": "jacksone",
  "madison.collins@x.dummyjson.com": "madisonc",
  "elijah.stewart@x.dummyjson.com": "elijahs",
  "chloe.morales@x.dummyjson.com": "chloem",
  "mateo.nguyen@x.dummyjson.com": "mateon",
  "harper.kelly@x.dummyjson.com": "harpere",
  "evelyn.gonzalez@x.dummyjson.com": "evelyng",
  "daniel.cook@x.dummyjson.com": "danielc",
  "lily.lee@x.dummyjson.com": "lilyb",
  "henry.hill@x.dummyjson.com": "henryh",
  "addison.wright@x.dummyjson.com": "addisonw",
};

export const getUserLoginByEmail = (email: string) => {
  return userEmailList[email] || email;
};
