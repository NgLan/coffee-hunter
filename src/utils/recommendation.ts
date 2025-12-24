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
        description: 'Wi-Fi tốt, yên tĩnh, có ổ cắm điện'
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
        description: 'Không gian rộng, nhiều chỗ ngồi, phù hợp họp mặt'
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
    // NEW TAGS - Phù hợp với mock data
    {
        id: 'food',
        label_jp: '食事',
        label_vn: 'Có đồ ăn',
        icon: '🍽️',
        description: 'Phục vụ đồ ăn, bữa sáng, bữa trưa, bánh ngọt'
    },
    {
        id: 'breakfast',
        label_jp: '朝食',
        label_vn: 'Bữa sáng',
        icon: '🥐',
        description: 'Có menu bữa sáng, mở cửa sớm'
    },
    {
        id: 'dessert',
        label_jp: 'デザート',
        label_vn: 'Bánh ngọt',
        icon: '🍰',
        description: 'Bánh handmade, tráng miệng, món ngọt'
    },
    {
        id: 'view',
        label_jp: '景色',
        label_vn: 'View đẹp',
        icon: '🌅',
        description: 'Tầng cao, view hồ, view sông, view thành phố'
    },
    {
        id: 'outdoor',
        label_jp: '屋外',
        label_vn: 'Ngoài trời',
        icon: '☀️',
        description: 'Chỗ ngồi ngoài trời, ban công, sân thượng'
    },
    {
        id: 'bar',
        label_jp: 'バー',
        label_vn: 'Có bar/Rượu',
        icon: '🍷',
        description: 'Có quầy bar, đồ uống có cồn, không khí tối'
    },
    {
        id: 'meeting',
        label_jp: '会議',
        label_vn: 'Họp/Làm việc nhóm',
        icon: '🤝',
        description: 'Có phòng họp, không gian cho team, projector'
    },
    {
        id: 'pet',
        label_jp: 'ペット',
        label_vn: 'Thú cưng',
        icon: '🐕',
        description: 'Cho phép mang thú cưng vào'
    },
    {
        id: 'music',
        label_jp: '音楽',
        label_vn: 'Âm nhạc',
        icon: '🎵',
        description: 'Nhạc sống, nhạc cổ điển, không gian nghệ thuật'
    },
    {
        id: 'lake',
        label_jp: '湖畔',
        label_vn: 'View hồ',
        icon: '🏞️',
        description: 'Bên hồ, view hồ Hoàn Kiếm'
    },
    {
        id: 'elegant',
        label_jp: 'エレガント',
        label_vn: 'Sang trọng',
        icon: '✨',
        description: 'Phong cách Pháp, decor cao cấp, không gian đẳng cấp'
    },
    {
        id: 'quiet',
        label_jp: '静か',
        label_vn: 'Yên tĩnh',
        icon: '🤫',
        description: 'Ít người, không ồn, không gian riêng tư'
    },
] as const;

export type UserNeedId = typeof USER_NEEDS[number]['id'];

/**
 * Keyword Mapping - Map từ khóa tiếng Việt/Nhật sang tag IDs
 * Dùng để parse câu chat của user (fallback khi AI không hoạt động)
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
    'cày': ['work'],
    'dl': ['work'],
    '仕事': ['work'],
    '勉強': ['work'],

    // Date related
    'date': ['date'],
    'hẹn hò': ['date'],
    'người yêu': ['date'],
    'bạn gái': ['date'],
    'bạn trai': ['date'],
    'lãng mạn': ['date'],
    'cưa gái': ['date'],
    'デート': ['date'],

    // Reading related
    'reading': ['reading'],
    'đọc': ['reading'],
    'đọc sách': ['reading'],
    'sách': ['reading'],
    '読書': ['reading'],

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

    // Food related - NEW
    'food': ['food'],
    'đồ ăn': ['food'],
    'đói': ['food', 'breakfast'],
    'ăn': ['food'],
    'hungry': ['food'],
    '食事': ['food'],

    // Breakfast - NEW
    'breakfast': ['breakfast', 'food'],
    'bữa sáng': ['breakfast', 'food'],
    'ăn sáng': ['breakfast', 'food'],
    'sáng': ['breakfast'],
    '朝食': ['breakfast', 'food'],

    // Dessert - NEW
    'dessert': ['dessert', 'food'],
    'bánh': ['dessert', 'food'],
    'bánh ngọt': ['dessert', 'food'],
    'tráng miệng': ['dessert', 'food'],
    'ngọt': ['dessert'],
    'cake': ['dessert', 'food'],
    'デザート': ['dessert', 'food'],

    // View - NEW
    'view': ['view'],
    'cảnh': ['view'],
    'phong cảnh': ['view'],
    'tầng cao': ['view', 'outdoor'],
    'rooftop': ['view', 'outdoor'],
    '景色': ['view'],

    // Outdoor - NEW
    'outdoor': ['outdoor'],
    'ngoài trời': ['outdoor'],
    'sân thượng': ['outdoor', 'view'],
    'ban công': ['outdoor'],
    '屋外': ['outdoor'],

    // Bar - NEW
    'bar': ['bar', 'relax'],
    'rượu': ['bar'],
    'bia': ['bar'],
    'cocktail': ['bar'],
    'バー': ['bar'],

    // Meeting - NEW
    'meeting': ['meeting', 'work'],
    'họp': ['meeting', 'work'],
    'phòng họp': ['meeting', 'work'],
    'team': ['meeting', 'group'],
    '会議': ['meeting'],

    // Pet - NEW
    'pet': ['pet', 'outdoor'],
    'thú cưng': ['pet', 'outdoor'],
    'chó': ['pet', 'outdoor'],
    'mèo': ['pet', 'outdoor'],
    'ペット': ['pet'],

    // Music - NEW
    'music': ['music', 'relax'],
    'âm nhạc': ['music'],
    'nhạc': ['music'],
    'live music': ['music'],
    '音楽': ['music'],

    // Lake - NEW
    'lake': ['lake', 'view'],
    'hồ': ['lake', 'view'],
    'hồ gươm': ['lake', 'view'],
    'hoàn kiếm': ['lake', 'view'],
    '湖': ['lake'],

    // Elegant - NEW
    'elegant': ['elegant'],
    'sang trọng': ['elegant'],
    'cao cấp': ['elegant'],
    'đẳng cấp': ['elegant'],
    'エレガント': ['elegant'],

    // Quiet - NEW
    'quiet': ['quiet'],
    'yên': ['quiet'],
    'yên tĩnh': ['quiet', 'reading'],
    'ít người': ['quiet'],
    'riêng tư': ['quiet'],
    '静か': ['quiet'],
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
