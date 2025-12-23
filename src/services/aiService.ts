import { GoogleGenerativeAI } from "@google/generative-ai";
import { USER_NEEDS } from "@/utils/recommendation";

// 1. Khởi tạo Gemini
// Lưu ý: Cần xử lý trường hợp chưa có Key để app không crash
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Analyze user request with Gemini AI
 * @param userText - ユーザーのメッセージ
 * @returns Promise<string[]> - 抽出されたタグの配列
 */
export const analyzeRequestWithAI = async (userText: string): Promise<string[]> => {
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEYが設定されていません！");
        return [];
    }

    try {
        // 2. モデルを選択（Flashは高速で安価）
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. AIにコンテキストを提供（システムのタグを教える）
        const tagsContext = USER_NEEDS.map(
            (n) => `- ID: "${n.id}" | 意味: ${n.label_jp} (${n.description})`
        ).join("\n");

        // 4. プロンプトエンジニアリング（最も重要）
        const prompt = `
あなたはハノイのカフェ検索を専門とするAIアシスタントです。

🎯 主な任務:
ユーザーの要望（文脈、感情、隠された意図）を深く分析し、システムのタグリストとマッチングしてください。

📋 システムタグリスト (${USER_NEEDS.length}個):
${tagsContext}

💬 ユーザーの要望: "${userText}"

🧠 スマート分析ルール:

**A. 文脈と隠れた意図を理解:**
1. "お腹が空いた", "hungry", "空腹" → ["food", "breakfast"] または ["food", "dessert"]
2. "朝", "早朝", "7時", "8時" → ["breakfast", "food"]
3. "朝食", "朝ごはん", "モーニング" → ["breakfast", "food"]
4. "昼食", "ランチ" → ["food"]
5. "おやつ", "ケーキ", "甘いもの", "デザート" → ["dessert", "food"]
6. "長居", "一日中", "何時間も" → ["work", "quiet"]
7. "デート", "彼女と", "恋人と" → ["date", "photo"]
8. "会議", "ミーティング", "グループ" → ["meeting", "work", "group"]
9. "犬連れ", "猫連れ", "ペット" → ["pet", "outdoor", "nature"]
10. "ビール", "お酒", "夜", "バー" → ["bar", "relax"]
11. "屋上", "高層", "ルーフトップ" → ["view", "outdoor", "photo"]
12. "湖畔", "ホアンキエム湖" → ["lake", "view", "photo"]

**B. 感情分析:**
- 悲しい、ストレス、疲れた → ["relax", "quiet", "nature"]
- 楽しい、わくわく → ["photo", "group"]
- 孤独、一人 → ["reading", "quiet", "relax"]

**C. 返却ルール:**
1. 必ず純粋なJSON配列で返却、例: ["work", "food"]
2. マークダウン（コードブロック形式）で返さない、説明も不要。
3. タグが見つからない場合 → []を返す。
4. 最も正確なタグを優先（最大4-5個）。
5. 関連するタグが複数ある場合は全て選択。

📝 例:
- "お腹が空いた、食事できるカフェ" → ["food", "breakfast"]
- "今夜ビールと景色を楽しみたい" → ["bar", "view", "outdoor"]
- "犬を連れて入れるカフェ" → ["pet", "outdoor", "nature"]
- "明日の朝会議用の個室" → ["meeting", "work", "group"]
- "疲れた、静かに本を読みたい" → ["reading", "quiet", "relax"]
- "ホアンキエム湖近くで朝食" → ["breakfast", "food", "lake"]
- "美味しいケーキでおやつタイム" → ["dessert", "food", "relax"]
`;

        // 5. API呼び出し
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 6. データクリーンアップ（AIが時々```json ... ```で返すため）
        const jsonString = text.replace(/```json|```/g, "").trim();

        const tags = JSON.parse(jsonString);

        // 配列であることを検証
        if (!Array.isArray(tags)) {
            console.warn("AIが配列を返しませんでした:", tags);
            return [];
        }

        // 有効なタグIDのみをフィルタリング
        const validTagIds = USER_NEEDS.map(n => n.id);
        const filteredTags = tags.filter(tag => validTagIds.includes(tag));

        return filteredTags;

    } catch (error) {
        console.error("Gemini APIエラー:", error);
        return []; // UIをクラッシュさせないように空配列を返す
    }
};
