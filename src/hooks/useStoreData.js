import { useState, useMemo } from "react";
import { MOCK_STORES } from "@/mocks/data/stores";
import { MOCK_REVIEWS } from "@/mocks/data/reviews";
import { MOCK_FAVORITES } from "@/mocks/data/users";

/**
 * Custom hook để quản lý dữ liệu stores
 * Bao gồm filter, sort và các thao tác liên quan
 */
export const useStoreData = () => {
    const [stores] = useState(MOCK_STORES);
    const [reviews] = useState(MOCK_REVIEWS);
    const [favorites, setFavorites] = useState(MOCK_FAVORITES);

    // Lấy reviews theo store ID
    const getReviewsByStoreId = (storeId) => {
        return reviews.filter((review) => review.store_id === storeId);
    };

    // Kiểm tra store có phải favorite không
    const isFavorite = (storeId) => {
        return favorites.includes(storeId);
    };

    // Toggle favorite
    const toggleFavorite = (storeId) => {
        setFavorites((prev) => {
            if (prev.includes(storeId)) {
                return prev.filter((id) => id !== storeId);
            }
            return [...prev, storeId];
        });
    };

    // Lấy favorite stores
    const getFavoriteStores = () => {
        return stores.filter((store) => favorites.includes(store.id));
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
        return stores.find((store) => store.id === parseInt(storeId));
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
    };
};
