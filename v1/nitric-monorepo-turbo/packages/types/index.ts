export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Guestbook {
  id: string;
  date: string;
  userId: string;
  message: string;
  email: string;
  name: string;
  image: string;
}
