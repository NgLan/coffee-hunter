// Định nghĩa món ăn (Menu Item)
export interface MenuItem {
    id: number;
    store_id?: number; // Optional vì khi lồng trong store object có thể không cần
    name_jp: string;
    price: number;
    description_jp?: string;
    image_url?: string;
}

// Định nghĩa Store cơ bản
export interface Store {
    id: number;
    name_jp: string;
    address_jp: string;
    latitude: number;
    longitude: number;
    opening_hours_jp?: string;
    phone_number?: string;
    description_jp?: string;
    avg_rating: number;
    review_count: number;
    main_image_url?: string;
    created_at?: string;
    updated_at?: string;
}

// Định nghĩa Store chi tiết 
// Extends từ Store gốc và thêm các field đã join
export interface StoreDetail extends Store {
    images: string[];      // Mảng URL từ bảng store_images
    menu: MenuItem[];      // Mảng object từ bảng menu_items
    services: string[];    // Mảng tên service từ bảng services join qua store_services
    space_type: "indoor" | "outdoor" | "both"; // Loại không gian: trong nhà, ngoài trời, hoặc cả hai
    distance?: number;     // Khoảng cách từ vị trí hiện tại (km) - optional, dùng cho display
}
