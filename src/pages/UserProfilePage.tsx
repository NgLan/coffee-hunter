import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProfileInfo from "@/components/features/profile/ProfileInfo";
import ProfileSidebar from "@/components/features/profile/ProfileSidebar";
import type { User as UserType } from "@/types/user";
import { MOCK_USERS } from "@/mocks/data/users";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserProfilePage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(currentUser);

    if (!currentUser) {
        navigate("/login");
        return null;
    }

    const handleUpdateField = (field: keyof UserType, value: string) => {
        if (userData) {
            setUserData({ ...userData, [field]: value });
        }
    };

    const handleSave = () => {
        if (isEditing) {
            if (!userData?.name.trim()) {
                toast({
                    variant: "destructive",
                    title: "入力エラー",
                    description: "名前を入力してください。",
                });
                return;
            }

            const rawSavedUsers = localStorage.getItem("mockUsers");
            const currentUsersList = rawSavedUsers
                ? JSON.parse(rawSavedUsers)
                : [...MOCK_USERS];

            const userIndex = currentUsersList.findIndex((u: UserType) => u.id === userData?.id);

            let updatedUsers;
            if (userIndex !== -1) {
                updatedUsers = [...currentUsersList];
                updatedUsers[userIndex] = userData;
            } else {
                updatedUsers = [...currentUsersList, userData];
            }

            localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));

            toast({
                title: "保存完了",
                description: "プロフィール情報が更新されました。",
            });
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 container mx-auto py-6 px-4 flex flex-col min-h-0">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 border rounded-lg bg-white shadow-sm overflow-hidden items-stretch">

                    <ProfileSidebar userData={userData} />

                    <div className="md:col-span-3 p-8 relative flex flex-col bg-white min-h-[600px]">
                        <ScrollArea className="flex-1">
                            <div className="p-8">
                                <ProfileInfo
                                    user={userData || currentUser}
                                    isEditing={isEditing}
                                    onUpdate={handleUpdateField}
                                />
                            </div>
                        </ScrollArea>

                        <div className="pt-4 bg-white flex justify-end">
                            <Button
                                onClick={handleSave}
                                variant="outline"
                                className="border-2 px-8 h-12 text-lg font-bold shadow-md hover:bg-accent"
                            >
                                {isEditing ? "セーブ" : "エディット"}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;
