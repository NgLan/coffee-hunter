import { useState, useMemo, useEffect } from "react";
import { MOCK_STORES } from "@/mocks/data/stores";
import { initReviews, addReview as persistAddReview } from "@/mocks/data/reviews";
import { MOCK_FAVORITES } from "@/mocks/data/users";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook để quản lý dữ liệu stores
 * Bao gồm filter, sort và các thao tác liên quan
 */
export const useStoreData = () => {
    const { currentUser } = useAuth();
    const [stores, setStores] = useState(MOCK_STORES);
    const [reviews, setReviews] = useState(() => initReviews());
    
    // State để lưu danh sách favorites (sync với localStorage)
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("user_favorites");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing favorites:", e);
                return MOCK_FAVORITES;
            }
        }
        // Nếu chưa có trong localStorage, dùng MOCK_FAVORITES
        return MOCK_FAVORITES;
    });

    // Sync favorites với localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem("user_favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Lấy reviews theo store ID
    const getReviewsByStoreId = (storeId) => {
        return reviews.filter((review) => review.store_id === storeId);
    };

    // Kiểm tra store có phải favorite không
    const isFavorite = (storeId) => {
        if (!currentUser) return false;
        return favorites.some(
            (fav) => fav.user_id === currentUser.id && fav.store_id === storeId
        );
    };

    // Toggle favorite
    const toggleFavorite = (storeId) => {
        if (!currentUser) {
            alert("ログインしてください");
            return;
        }

        const isCurrentlyFavorite = isFavorite(storeId);

        if (isCurrentlyFavorite) {
            // Xóa khỏi favorites
            setFavorites((prev) =>
                prev.filter(
                    (fav) =>
                        !(fav.user_id === currentUser.id && fav.store_id === storeId)
                )
            );
        } else {
            // Thêm vào favorites
            const newFavorite = {
                id: Date.now(), // Generate unique ID
                user_id: currentUser.id,
                store_id: storeId,
                created_at: new Date().toISOString(),
            };
            setFavorites((prev) => [...prev, newFavorite]);
        }
    };

    // Lấy favorite stores của user hiện tại
    const getFavoriteStores = () => {
        if (!currentUser) return [];
        
        const favoriteStoreIds = favorites
            .filter((fav) => fav.user_id === currentUser.id)
            .map((fav) => fav.store_id);

        return stores.filter((store) => favoriteStoreIds.includes(store.id));
    };

    // Filter stores theo rating, services và space_type
    const filterStores = (minRating = 0, selectedServices = [], selectedSpaceTypes = []) => {
        return stores.filter((store) => {
            // Filter theo rating
            const ratingMatch = store.avg_rating >= minRating;

            // Filter theo services (nếu có chọn services)
            const servicesMatch =
                selectedServices.length === 0 ||
                selectedServices.every((service) => store.services.includes(service));

            // Filter theo space_type (indoor/outdoor)
            const spaceTypeMatch =
                selectedSpaceTypes.length === 0 ||
                selectedSpaceTypes.some(
                    (spaceType) =>
                        store.space_type === "both" || store.space_type === spaceType
                );

            return ratingMatch && servicesMatch && spaceTypeMatch;
        });
    };

    // Sort stores
    const sortStores = (storeList, sortBy = "rating") => {
        const sorted = [...storeList];

        switch (sortBy) {
            case "rating":
                return sorted.sort((a, b) => b.avg_rating - a.avg_rating);
            case "reviews":
                return sorted.sort((a, b) => b.review_count - a.review_count);
            case "name":
                return sorted.sort((a, b) => a.name_jp.localeCompare(b.name_jp));
            default:
                return sorted;
        }
    };

    // Search stores theo tên hoặc địa chỉ
    const searchStores = (query) => {
        if (!query) return stores;
        const lowercaseQuery = query.toLowerCase();
        return stores.filter(
            (store) =>
                store.name_jp.toLowerCase().includes(lowercaseQuery) ||
                store.address_jp.toLowerCase().includes(lowercaseQuery) ||
                store.description_jp.toLowerCase().includes(lowercaseQuery)
        );
    };

    // Lấy store theo ID
    const getStoreById = (storeId) => {
        return stores.find((store) => store.id === parseInt(storeId, 10));
    };

    // Thêm review mới vào danh sách và cập nhật store stats (avg_rating, review_count)
    const addReview = (storeId, newReview) => {
        // Persist review to localStorage via mocks helper
        // We pass a copy: the mock's addReview expects fields without 'id' and 'created_at'
        const payloadToPersist = {
                ...newReview,
                store_id: storeId,
                rating: typeof newReview.rating === 'number' ? newReview.rating : Number(newReview.rating) || 0,
                comment: newReview.comment || '',
                images: Array.isArray(newReview.images) ? newReview.images : [],
                user_name: newReview.user_name || newReview.author || '匿名',
                user_avatar: newReview.user_avatar || newReview.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=random',
                // ensure we don't include keys that mock doesn't expect id/created_at
            };
        const createdReview = persistAddReview(payloadToPersist);
        console.log('[useStoreData] addReview persisted:', createdReview);

        // Update local state with the newly persisted review
        setReviews((prevReviews) => [createdReview, ...prevReviews]);

        // Update stores stats
        setStores((prevStores) =>
            prevStores.map((s) => {
                if (s.id === storeId) {
                    const oldCount = s.review_count ?? 0;
                    const oldAvg = s.avg_rating ?? 0;
                    const newCount = oldCount + 1;
                    const newAvg = (oldAvg * oldCount + createdReview.rating) / newCount;
                    return {
                        ...s,
                        review_count: newCount,
                        avg_rating: parseFloat(newAvg.toFixed(1)),
                    };
                }
                return s;
            })
            );

        return createdReview;
    };

    return {
        stores,
        reviews,
        favorites,
        getReviewsByStoreId,
        isFavorite,
        toggleFavorite,
        getFavoriteStores,
        filterStores,
        sortStores,
        searchStores,
        getStoreById,
        addReview,
    };
};