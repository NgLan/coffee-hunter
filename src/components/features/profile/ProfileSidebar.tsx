import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { User as UserType } from "@/types/user";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileSidebarProps {
    userData: UserType | null;
}

const ProfileSidebar = ({ userData }: ProfileSidebarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="hidden md:flex md:col-span-1 border-r bg-white flex-col h-full shrink-0">
            <div className="p-6 flex flex-col items-center flex-grow">
                {/* Avatar */}
                <div className="w-32 h-32 border-2 flex items-center justify-center bg-white overflow-hidden mb-8 rounded-full shadow-sm shrink-0">
                    {userData?.avatar_url ? (
                        <img src={userData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-muted-foreground italic">Image</span>
                    )}
                </div>

                {/* Menu Buttons */}
                <div className="w-full space-y-3">
                    <Button
                        variant={isActive("/profile") ? "outline" : "ghost"}
                        className={`w-full justify-center text-base font-medium h-12 ${isActive("/profile") ? "bg-[#D4BC99] text-white hover:bg-[#C4AC89] border-none" : "border"
                            }`}
                        onClick={() => navigate("/profile")}
                    >
                        詳細情報
                    </Button>
                    <Button
                        variant={isActive("/favorites") ? "outline" : "ghost"}
                        className={`w-full justify-center text-base font-medium h-12 ${isActive("/favorites") ? "bg-[#D4BC99] text-white hover:bg-[#C4AC89] border-none" : "border"
                            }`}
                        onClick={() => navigate("/favorites")}
                    >
                        お気に入りリスト
                    </Button>
                </div>
            </div>

            {/* Logout */}
            <div className="p-6 mt-auto shrink-0">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center w-full gap-2 text-lg font-bold text-slate-600 hover:text-destructive transition-colors">
                            ログアウト <LogOut className="w-5 h-5" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                                ログアウトすると、再度ログインが必要になります。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                ログアウト
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default ProfileSidebar;
