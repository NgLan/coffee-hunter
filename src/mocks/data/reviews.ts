// reviews.ts
import type { Review } from "../../types/review";

// --- MOCK DATA ---
export const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        user_id: 1,
        store_id: 1,
        rating: 5,
        comment:
            "本当に素晴らしいカフェです！雰囲気が最高で、コーヒーもとても美味しかったです。スタッフも親切で、またぜひ訪れたいと思います。",
        created_at: "2024-11-15T10:30:00",
        images: [
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600",
        ],
        user_name: "田中太郎",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka",
    },
    {
        id: 2,
        user_id: 2,
        store_id: 1,
        rating: 4,
        comment:
            "コヒーの味は素晴らしいです。ただ、週末は少し混雑していて、席を見つけるのが大変でした。それでも、また来たいカフェです。",
        created_at: "2024-11-14T15:45:00",
        images: [],
        user_name: "佐藤花子",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
    },
    {
        id: 3,
        user_id: 3,
        store_id: 2,
        rating: 5,
        comment:
            "ホアンキエム湖の景色が素晴らしい！2階の席から湖を眺めながらコーヒーを飲むのは最高の体験でした。エッグコーヒーは絶対に試すべきです。",
        created_at: "2024-11-13T09:20:00",
        images: ["https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600"],
        user_name: "鈴木一郎",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki",
    },
    {
        id: 4,
        user_id: 1,
        store_id: 3,
        rating: 5,
        comment:
            "仕事をするのに完璧な場所です。静かで、Wi-Fiも速く、電源コンセントもあります。コーヒーの質も高いです。",
        created_at: "2024-11-12T14:10:00",
        images: [],
        user_name: "田中太郎",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka",
    },
    {
        id: 5,
        user_id: 2,
        store_id: 4,
        rating: 4,
        comment:
            "庭園が本当に美しいです。自然の中でリラックスできる貴重な場所。スムージーも新鮮で美味しかったです。",
        created_at: "2024-11-11T11:30:00",
        images: ["https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600"],
        user_name: "佐藤花子",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
    },
    {
        id: 5,
        user_id: 2,
        store_id: 1,
        rating: 4,
        comment: "コヒーの味は素晴らしいです。ただ、週末は少し混雑していて、席を見つけるのが大変でした。それでも、また来たいカフェです。",
        created_at: "2024-11-14T15:45:00",
        images: [],
         user_name: "佐藤花子",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
    },
    {
        id: 6,
        user_id: 3,
        store_id: 1,
        rating: 2,
        comment: "コーヒーの味は素晴らしいです。ただ、週末は少し混雑していて、席を見つけるのが大変でした。それでも、また来たいカフェです。",
        created_at: "2024-11-14T15:45:00",
        images: [
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
        ],
        user_name: "鈴木一郎",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki",
       
    },
];

// ===================================================================
// 📌 STORAGE KEY
// ===================================================================
const STORAGE_KEY = "reviews_data";

// ===================================================================
// 📌 Init reviews: combine localStorage + MOCK
// ===================================================================
export function initReviews(): Review[] {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
        return MOCK_REVIEWS;
    }

    return JSON.parse(saved) as Review[];
}

// ===================================================================
// 📌 Get reviews by store ID
// ===================================================================
export function getReviewsByStoreId(storeId: number): Review[] {
    const all = initReviews();
    return all.filter((r) => r.store_id === storeId);
}

// ===================================================================
// 📌 Save new review
// ===================================================================
export function addReview(newReview: Omit<Review, "id" | "created_at">) {
    const all = initReviews();

    // Ensure required fields and defaults
    const review: Review = {
        ...newReview,
        id: all.length + 1,
        created_at: new Date().toISOString(),
        rating: typeof newReview.rating === 'number' ? newReview.rating : 0,
        comment: newReview.comment || '',
        images: Array.isArray(newReview.images) ? newReview.images : [],
        user_name: newReview.user_name || '匿名',
        user_avatar: newReview.user_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=random',
        store_id: newReview.store_id,
        user_id: newReview.user_id,
    };

    all.unshift(review); // hiển thị review mới ở đầu

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return review;
}
