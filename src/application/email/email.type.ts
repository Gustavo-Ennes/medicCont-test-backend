export type BuildEmailOptionsParam = {
  to: {
    name: string;
    address: string;
  };
  subject: string;
  html: string;
  category: string;
};
