import type { User } from '../../types/user';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "田中太郎",
    email: "tanaka@example.com",
    password: "Tanaka@123",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka",
    birthday: "1990-05-15",
    gender: "male",
  },
  {
    id: 2,
    name: "佐藤花子",
    email: "sato@example.com",
     password: "Sato@123",
     
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
    birthday: "1992-08-20",
    gender: "female",
  },
  {
    id: 3,
    name: "鈴木一郎",
    email: "suzuki@example.com",
    password: "Suzuki@123",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki",
    birthday: "1988-03-10",
    gender: "male",
  },
];
export const MOCK_FAVORITES = [
  { user_id: 1, store_id: 1 },  // User 1 likes Store 1
  { user_id: 1, store_id: 3 },  // User 1 likes Store 3
  { user_id: 1, store_id: 5 },  // User 1 likes Store 5
  { user_id: 1, store_id: 6 },  // User 1 likes Store 6 (Rooftop View - gần nhất 0.8km)
  { user_id: 2, store_id: 2 },  // User 2 likes Store 2
  { user_id: 2, store_id: 4 },  // User 2 likes Store 4
  { user_id: 3, store_id: 7 },  // User 3 likes Store 7
];
