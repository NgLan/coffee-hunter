import { User as UserIcon, Mail, Home, Calendar, VenusAndMars } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User as UserType } from "@/types/user";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProfileInfoProps {
    user: UserType;
    isEditing: boolean;
    onUpdate: (field: keyof UserType, value: string) => void;
}

const ProfileInfo = ({ user, isEditing, onUpdate }: ProfileInfoProps) => {
    const genderDisplay = (g?: string) => {
        if (g === "male") return "男性";
        if (g === "female") return "女性";
        return "その他";
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold border-b-2 border-black/10 pb-2 mb-6">詳細情報</h2>

            {/* Tên */}
            <div className="flex items-center gap-6">
                <div className="w-10 flex justify-center">
                    <UserIcon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex flex-1 items-center gap-2">
                    <Label className="min-w-[100px] text-lg font-bold">
                        名前<span className="text-destructive ml-1"></span>:
                    </Label>
                    <div className="flex flex-col flex-1 gap-1">
                        {isEditing ? (
                            <>
                                <Input
                                    value={user.name}
                                    onChange={(e) => onUpdate("name", e.target.value)}
                                    required
                                    className={`max-w-sm ${!user.name.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    placeholder="名前を入力してください"
                                />
                                {!user.name.trim() && (
                                    <span className="text-xs text-destructive font-medium">
                                        名前は必須項目です。
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-lg">{user.name}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-6">
                <div className="w-10 flex justify-center"><Mail className="w-8 h-8 text-blue-400" /></div>
                <div className="flex flex-1 items-center gap-2">
                    <Label className="min-w-[100px] text-lg font-bold">メール:</Label>
                    <span className="text-lg">{user.email}</span>
                </div>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-center gap-6">
                <div className="w-10 flex justify-center"><Home className="w-8 h-8 text-blue-400" /></div>
                <div className="flex flex-1 items-center gap-2">
                    <Label className="min-w-[100px] text-lg font-bold">所在地:</Label>
                    {isEditing ? (
                        <Input value={user.location} onChange={(e) => onUpdate("location", e.target.value)} className="max-w-sm" />
                    ) : (
                        <span className="text-lg">{user.location}</span>
                    )}
                </div>
            </div>

            {/* Ngày đăng ký */}
            <div className="flex items-center gap-6">
                <div className="w-10 flex justify-center"><Calendar className="w-8 h-8 text-blue-400" /></div>
                <div className="flex flex-1 items-center gap-2">
                    <Label className="min-w-[100px] text-lg font-bold">登録日:</Label>
                    <span className="text-lg">{user.registration_date}</span>
                </div>
            </div>

            {/* 3. Giới tính - Dùng Select khi Edit */}
            <div className="flex items-center gap-6">
                <div className="w-10 flex justify-center"><VenusAndMars className="w-8 h-8 text-blue-400" /></div>
                <div className="flex flex-1 items-center gap-2">
                    <Label className="min-w-[100px] text-lg font-bold">性別:</Label>
                    {isEditing ? (
                        <Select
                            value={user.gender}
                            onValueChange={(value) => onUpdate("gender", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="性別を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">男性</SelectItem>
                                <SelectItem value="female">女性</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <span className="text-lg">{genderDisplay(user.gender)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
