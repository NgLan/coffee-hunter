/* components/layout/CoffeeBackground.tsx */
import React, { useMemo } from 'react';

const AuthBackground: React.FC = () => {
  const sourceImages = [
    "https://cdn3.ivivu.com/2022/08/quan-cafe-da-nang-ivivu-2.jpg?q=80&w=600&auto=format&fit=crop",
    "https://domingocoffee.com.vn/wp-content/uploads/2021/10/setup-quan-cafe-1.jpg?q=80&w=600&auto=format&fit=crop",
    "https://tse1.explicit.bing.net/th/id/OIP.zHa4h92TI8AXlta9DOF8awHaFy?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://th.bing.com/th/id/R.9f0d4eced2535ca33b23acf6290cec31?rik=M2NOg0IqRE0J3Q&riu=http%3a%2f%2freviewvilla.vn%2fwp-content%2fuploads%2f2022%2f05%2fTOP-20-QUAN-CAFE-DEP-O-HA-NOI-1.1.jpg&ehk=VGiFvFpPwDFZGHsaqlvqo2XzmWBXT0hU00hKNhF5Y3o%3d&risl=&pid=ImgRaw&r=0?q=80&w=600&auto=format&fit=crop",
    "https://static.chotot.com/storage/chotot-kinhnghiem/nha/2024/11/4f603832-cafe-noong-oi-631.jpg?q=80&w=600&auto=format&fit=crop",
    "https://caphenguyenchat.vn/wp-content/uploads/2019/09/cach-trang-tri-quan-cafe-don-gian-5-1.jpg?q=80&w=600&auto=format&fit=crop",
    "https://ik.imagekit.io/tvlk/blog/2017/11/ca-phe-vintage-sai-gon-13.jpg?tr=dpr-2,w-675?q=80&w=600&auto=format&fit=crop",
    "https://tse1.mm.bing.net/th/id/OIP.8ke2xGItHktIbbLLXIz8uAHaFn?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://www.tapdoantrananh.com.vn/uploads/files/2023/01/18/mau-quan-cafe-phong-cach-vintage-2.jpg?q=80&w=600&auto=format&fit=crop",
    "https://ats.vietnamtourism.gov.vn/wp-content/uploads/2022/12/cafe-trung1-906x1024.jpg?q=80&w=600&auto=format&fit=crop",
    "https://halotravel.vn/wp-content/uploads/2020/08/maianh.ng99_70248448_482656829240694_3238208180527795631_n-820x1024.jpg?q=80&w=600&auto=format&fit=crop",
    "https://vietnamreviewer.com/wp-content/uploads/2023/10/Ca-Phe-Bao-Cap-1975-Thai-Binh.jpg?q=80&w=600&auto=format&fit=crop",
  ];

  // Nhân bản ảnh 4 lần (48 ảnh) để đảm bảo không bao giờ thiếu hụt dù màn hình 4K
  const images = useMemo(() => [...sourceImages, ...sourceImages, ...sourceImages, ...sourceImages], [sourceImages]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-300">
      
      {/* CHIẾN THUẬT BAO PHỦ TOÀN DIỆN:
         1. w-[150vw] h-[150vh]: Chiều rộng/cao bằng 150% màn hình thiết bị.
         2. top-1/2 left-1/2: Đặt điểm neo vào giữa màn hình.
         3. -translate-x-1/2 -translate-y-1/2: Kéo ngược lại để căn giữa hoàn toàn.
         4. rotate-[-5deg]: Xoay nhẹ để tạo chất nghệ thuật (hoặc xóa đi nếu muốn thẳng hàng).
      */}
      <div 
        className="absolute top-[60%] left-[60%] w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg]"
      >
        <div className="columns-3 md:columns-4 lg:columns-6 gap-3 w-full h-full">
          {images.map((src, index) => (
            <div key={index} className="mb-3 break-inside-avoid inline-block w-full">
              <img 
                src={src} 
                alt="Coffee Decor" 
                loading="lazy"
                className="w-full h-auto rounded-sm object-cover  transition-all duration-700 opacity-50 hover:opacity-100" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lớp phủ màu nâu vàng nhạt (đã giảm opacity) */}
      <div className="absolute inset-0 bg-[#4a4036]/50 backdrop-blur-[2px]"></div>
    </div>
  );
};

export default AuthBackground;