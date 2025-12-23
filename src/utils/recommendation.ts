import type { StoreDetail } from '../types/store';

/**
 * User Needs Configuration - Nhu cầu của người dùng
 * Định nghĩa các nhu cầu phổ biến khi đi cafe
 */
export const USER_NEEDS = [
    {
        id: 'work',
        label_jp: '仕事・勉強',
        label_vn: 'Làm việc/Học bài',
        icon: '💻',
        description: 'Wi-Fi tốt, yên tĩnh, có ổ cắm'
    },
    {
        id: 'date',
        label_jp: 'デート',
        label_vn: 'Hẹn hò',
        icon: '💑',
        description: 'Lãng mạn, view đẹp, không gian riêng tư'
    },
    {
        id: 'reading',
        label_jp: '読書',
        label_vn: 'Đọc sách',
        icon: '📚',
        description: 'Yên tĩnh, ánh sáng tốt, ghế ngồi thoải mái'
    },
    {
        id: 'photo',
        label_jp: '写真撮影',
        label_vn: 'Sống ảo',
        icon: '📸',
        description: 'Decor đẹp, góc check-in, ánh sáng tự nhiên'
    },
    {
        id: 'group',
        label_jp: 'グループ',
        label_vn: 'Tụ tập nhóm',
        icon: '👥',
        description: 'Không gian rộng, nhiều chỗ ngồi'
    },
    {
        id: 'relax',
        label_jp: 'リラックス',
        label_vn: 'Thư giãn',
        icon: '😌',
        description: 'Yên bình, không gian xanh, âm nhạc nhẹ nhàng'
    },
    {
        id: 'nature',
        label_jp: '自然',
        label_vn: 'Thiên nhiên',
        icon: '🌿',
        description: 'Sân vườn, cây xanh, không khí trong lành'
    },
] as const;

export type UserNeedId = typeof USER_NEEDS[number]['id'];

/**
 * Keyword Mapping - Map từ khóa tiếng Việt/Nhật sang tag IDs
 * Dùng để parse câu chat của user
 */
export const KEYWORD_MAPPING: Record<string, string[]> = {
    // Work related
    'work': ['work'],
    'làm việc': ['work'],
    'học': ['work'],
    'học bài': ['work'],
    'thi': ['work'],
    'deadline': ['work'],
    'coding': ['work'],
    'laptop': ['work'],
    'wifi': ['work'],
    'ổ cắm': ['work'],
    '仕事': ['work'],
    '勉強': ['work'],

    // Date related
    'date': ['date'],
    'hẹn hò': ['date'],
    'người yêu': ['date'],
    'bạn gái': ['date'],
    'bạn trai': ['date'],
    'lãng mạn': ['date'],
    'デート': ['date'],

    // Reading related
    'reading': ['reading'],
    'đọc': ['reading'],
    'đọc sách': ['reading'],
    'sách': ['reading'],
    'yên tĩnh': ['reading', 'quiet'],
    '読書': ['reading'],
    '静か': ['reading', 'quiet'],

    // Photo related
    'photo': ['photo'],
    'chụp ảnh': ['photo'],
    'sống ảo': ['photo'],
    'check in': ['photo'],
    'instagram': ['photo'],
    'đẹp': ['photo'],
    'decor': ['photo'],
    '写真': ['photo'],

    // Group related
    'group': ['group'],
    'nhóm': ['group'],
    'bạn bè': ['group'],
    'tụ tập': ['group'],
    'họp': ['group'],
    'meeting': ['group'],
    'グループ': ['group'],

    // Relax related
    'relax': ['relax'],
    'thư giãn': ['relax'],
    'nghỉ ngơi': ['relax'],
    'chill': ['relax'],
    'リラックス': ['relax'],

    // Nature related
    'nature': ['nature'],
    'thiên nhiên': ['nature'],
    'cây': ['nature'],
    'vườn': ['nature'],
    'sân vườn': ['nature'],
    'xanh': ['nature'],
    '自然': ['nature'],
    '庭': ['nature'],

    // Additional qualities
    'quiet': ['reading', 'work'],
    'yên': ['reading', 'work'],
    'view': ['photo', 'date'],
    'pet': ['nature', 'relax'],
    'thú cưng': ['nature', 'relax'],
};

/**
 * Extract tags from user's chat text
 * @param text - Câu chat của user (tiếng Việt hoặc tiếng Nhật)
 * @returns Mảng các tag IDs tương ứng
 * 
 * @example
 * extractTagsFromText("Tôi muốn tìm quán để học bài") 
 * // => ['work']
 * 
 * extractTagsFromText("Quán nào đẹp để hẹn hò và chụp ảnh?")
 * // => ['date', 'photo']
 */
export const extractTagsFromText = (text: string): string[] => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    const normalizedText = text.toLowerCase().trim();
    const foundTags = new Set<string>();

    // Duyệt qua tất cả keywords trong mapping
    Object.entries(KEYWORD_MAPPING).forEach(([keyword, tags]) => {
        // Check if keyword appears in text
        if (normalizedText.includes(keyword.toLowerCase())) {
            // Add all related tags
            tags.forEach(tag => foundTags.add(tag));
        }
    });

    return Array.from(foundTags);
};

/**
 * Get recommended stores based on user needs
 * @param stores - Danh sách tất cả các quán
 * @param selectedNeedIds - Mảng các nhu cầu đã chọn
 * @returns Danh sách quán phù hợp đã được sắp xếp theo độ phù hợp
 */
export const getRecommendations = (
    stores: StoreDetail[],
    selectedNeedIds: string[]
): StoreDetail[] => {
    // Nếu không chọn gì, trả về tất cả (hoặc empty tùy UX)
    if (!selectedNeedIds || selectedNeedIds.length === 0) {
        return stores;
    }

    // Filter stores that match at least one selected need
    const matchedStores = stores.filter(store => {
        if (!store.tags || store.tags.length === 0) return false;

        // Check if store has ANY of the selected needs
        return selectedNeedIds.some(needId =>
            store.tags!.includes(needId)
        );
    });

    // Calculate matching score and sort
    const storesWithScore = matchedStores.map(store => {
        // Score = số lượng tags trùng khớp
        const matchCount = selectedNeedIds.filter(needId =>
            store.tags!.includes(needId)
        ).length;

        return {
            store,
            score: matchCount
        };
    });

    // Sort by score (descending), then by rating
    storesWithScore.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // Score cao hơn lên trước
        }
        return b.store.avg_rating - a.store.avg_rating; // Rating cao hơn lên trước
    });

    return storesWithScore.map(item => item.store);
};

/**
 * Get matching percentage for a store
 * @param store - Store cần tính
 * @param selectedNeedIds - Các nhu cầu đã chọn
 * @returns Percentage (0-100)
 */
export const getMatchingPercentage = (
    store: StoreDetail,
    selectedNeedIds: string[]
): number => {
    if (!store.tags || store.tags.length === 0) return 0;
    if (!selectedNeedIds || selectedNeedIds.length === 0) return 0;

    const matchCount = selectedNeedIds.filter(needId =>
        store.tags!.includes(needId)
    ).length;

    return Math.round((matchCount / selectedNeedIds.length) * 100);
};
