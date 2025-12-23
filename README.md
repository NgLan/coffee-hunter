# ☕️ Coffee Hunter

**Coffee Hunter** là ứng dụng web giúp người dùng tìm kiếm, đánh giá và khám phá các quán cà phê tuyệt vời tại khu vực Hà Nội.

Dự án này là **Frontend-only**, được xây dựng bằng React, TypeScript và Vite, sử dụng dữ liệu giả (Mock Data) để mô phỏng tương tác với Backend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-sky)

## 🚀 Tính năng chính (Features)

| Chức năng | Quyền hạn | Mô tả ngắn |
|-----------|-----------|------------|
| **1. Chi tiết quán** | Guest/User | Xem thông tin, menu, ảnh. Hiển thị trạng thái yêu thích nếu đã login. |
| **2. Xem Review** | Guest/User | Xem danh sách đánh giá, phân trang (10 item/trang). Review của bản thân hiện đầu tiên. |
| **3. Bản đồ (Map)** | User | Hiển thị vị trí quán trên bản đồ Hà Nội. Sidebar hiển thị quán gần nhất. |
| **4. Đăng Review** | User | Đánh giá sao, viết bình luận (>20 ký tự), upload tối đa 3 ảnh. |
| **5. Tìm kiếm & Lọc** | User | Tìm theo từ khóa, lọc theo: Số sao, Không gian, Tiện ích (Wifi, AC...). |
| **6. Auth** | Guest | Đăng ký/Đăng nhập với Validate password chặt chẽ. |
| **7. Gợi ý (Recommend)**| User | **Hot Pick** (theo sở thích) và **Near By You** (theo vị trí/khoảng cách). |
| **8. Yêu thích** | User | Lưu quán vào danh sách yêu thích (Max 50 quán). |
| **9. Thông báo** | User | Nhận thông tin khuyến mãi, món mới. Đánh dấu đã đọc. |
| **10. User Profile** | User | Xem và chỉnh sửa thông tin cá nhân (Avatar, Tên, Ngày sinh...). |

## 🛠 Công nghệ sử dụng

- **Core:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **State Management:** React Context API & Hooks
- **Map:** Leaflet / React-Leaflet 

## ⚙️ Yêu cầu cài đặt

Đảm bảo máy của bạn đã cài đặt:
- [Node.js](https://nodejs.org/)
- npm 

## 📦 Hướng dẫn chạy dự án (Getting Started)

1. **Clone dự án về máy:**
   ```bash
   git clone https://github.com/NgLan/coffee-hunter.git
   cd coffee-hunter
   ```

2. **Cài đặt các thư viện phụ thuộc (Dependencies):**
   Chạy lệnh sau để tải về các gói `node_modules` cần thiết:
   ```bash
   npm install
   ```

3. **Cấu hình API Key (Quan trọng!):**
   
   Tạo file `.env` trong thư mục gốc và thêm Gemini API Key:
   ```bash
   cp .env.example .env
   ```
   
   Sau đó mở file `.env` và thay thế `your_api_key_here` bằng API key của bạn:
   ```
   VITE_GEMINI_API_KEY=AIza...your_actual_key_here
   ```
   
   **Lấy API Key miễn phí tại:** https://aistudio.google.com/app/apikey
   
   > **Lưu ý:** File `.env` đã được thêm vào `.gitignore` để bảo mật API key của bạn.

4. **Khởi chạy server phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Sau đó truy cập vào đường dẫn hiển thị trên terminal (`http://localhost:5173`).

## 📂 Cấu trúc thư mục (Project Structure)

```bash
src/
├── assets/          # Hình ảnh, icons, fonts tĩnh
├── components/      # Các component tái sử dụng (Button, Input, Cards...)
│   ├── common/      # Các component chung
│   ├── layout/      # Header, Footer, Sidebar
│   └── ui/          # Các component từ Shadcn UI
├── contexts/        # React Context (AuthContext, ThemeContext...)
├── mocks/data/      # Mock Data (JSON/TS files giả lập Database)
├── hooks/           # Custom Hooks (useAuth, useFetch...)
├── lib/             # Cấu hình thư viện bổ trợ (utils cho Shadcn/Tailwind)
├── services/        # Các hàm giả lập gọi API (AuthService, ShopService...)
├── pages/           # Các trang chính (Home, Detail, Login, Profile...)
├── types/           # Định nghĩa TypeScript Interfaces/Types
├── utils/           # Các hàm tiện ích (formatDate, calculateRating...)
├── App.tsx          # Component gốc & Cấu hình Routing
└── main.tsx         # Entry point
```

## 🌲 Quy tắc Git (Git Conventions)

Để đảm bảo sự đồng bộ trong quá trình phát triển, dự án tuân thủ các quy tắc sau:

### 1. Đặt tên nhánh (Branch Naming)
Format chung: **`type/ten-chuc-nang`**

Các tiền tố (**type**) quy định:
- **`feature/`**: Phát triển tính năng mới.
  - *Ví dụ:* `feature/login-page`, `feature/map-integration`
- **`fix/`**: Sửa lỗi (Bug fix).
  - *Ví dụ:* `fix/responsive-header`, `fix/login-error`
- **`refactor/`**: Sắp xếp lại code, đổi tên file/folder (không thay đổi logic).
  - *Ví dụ:* `refactor/folder-structure`, `refactor/auth-hook`
- **`docs/`**: Cập nhật tài liệu (Readme, Documents).
  - *Ví dụ:* `docs/update-readme`

### 2. Quy trình Commit & Push
1. Luôn `git pull` từ nhánh chính (`main`) trước khi tạo nhánh mới.
2. Đặt message commit rõ ràng, có ý nghĩa (Tiếng Anh hoặc Tiếng Việt).
   - *Tốt:* `feat: Add login form layout` hoặc `Add: Giao diện đăng nhập`
   - *Không tốt:* `fix`, `update`, `code`, `abc`
   