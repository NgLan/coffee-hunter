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
  {
    id: 4,
    name: "タイン",
    email: "dinhthanh@gmail.com",
    password: "12345678@a",
    avatar_url: "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-1/484741430_672181875479197_1230510635255675482_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=111&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFDKKzzqqkTWqwVTpBNWR23X3gPyAttmJ9feA_IC22Yn0Z-mz6fclzu9jMcTvv3YHvfMmGdJKdU3czhoUNTD1XS&_nc_ohc=4qv01dYvCyIQ7kNvwGb35Oq&_nc_oc=AdldMU1YnOf1dCrd3-BZy_0f3Qgys12-7Fbh4a6Mx3TO_IWnvo834CF0rMRUOiq8PMw&_nc_zt=24&_nc_ht=scontent.fhan3-3.fna&_nc_gid=v7gfQE34GlrbKOJBSHug_A&oh=00_AfniEPBzB2deDWvWZphTAbUGNk38671VhCO_ThYyGpUV6Q&oe=694003E5",
    birthday: "2004-04-30",
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
  { user_id: 4, store_id: 8 },  // User 4 likes Store 8
  { user_id: 4, store_id: 1 },  // User 4 likes Store 1
  { user_id: 4, store_id: 5 },  // User 4 likes Store 5
];
