import { useState, useEffect } from "react";
import { Search, Bell, User } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

/**
 * Header component - Thanh điều hướng chính
 * Bao gồm: Logo, Search, Notifications, User Avatar
 */
const Header = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { notifications, unreadCount } = useNotifications();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    
    // Cập nhật search query từ URL params khi trang load hoặc URL thay đổi
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setSearchQuery(q);
        }
    }, [searchParams]);

    console.log("Current User in Header:", currentUser);

    // Xử lý search
    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
            // Nếu không có query, hiển thị tất cả các quán
            // Clear search input và navigate về /search với timestamp để force reload
            setSearchQuery("");
            navigate(`/search?t=${Date.now()}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-8xl">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-coffee-medium to-coffee-dark">
                            <span className="text-xl font-bold text-primary-foreground">CH</span>
                        </div>
                        <span className="hidden text-xl font-bold text-coffee-dark md:inline-block">
                            Coffee Hunter
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden flex-1 max-w-5xl md:flex">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="カフェを検索..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Search */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Search className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="p-4">
                                <form onSubmit={handleSearch} className="w-full">
                                    <Input
                                        type="search"
                                        placeholder="カフェを検索..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </form>
                            </SheetContent>
                        </Sheet>

                        {/* Notifications */}
                        {isAuthenticated && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="relative"
                                onClick={() => navigate('/notifications')}
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                    >
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        {currentUser?.avatar_url ? (
                                            <img
                                                src={currentUser.avatar_url}
                                                alt={currentUser.name}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        ) : (
                                            <User className="h-5 w-5" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        プロフィール
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/favorites")}>
                                        お気に入り
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        ログアウト
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button 
                                    onClick={() => navigate("/login")}
                                    variant="outline"
                                    className="rounded-lg px-6"
                                >
                                    ログイン
                                </Button>
                                <Button 
                                    onClick={() => navigate("/register")}
                                    className="rounded-lg px-6"
                                >
                                    登録
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
