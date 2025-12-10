import React, { useState, useMemo, useEffect} from "react";
import { MapPin, ArrowRight, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import StoreCard from "@/components/features/StoreCard";
import { useStoreData } from "@/hooks/useStoreData";
import { MOCK_FAVORITES } from "@/mocks/data/users";

/**
 * Hot Pickロジック：レーティング、レビュー数、重み付きランダムで最大5件
 */
const getHotPickStores = (stores) => {
    // 重み付きスコアを計算
    const storesWithScore = stores.map(store => {
        // レーティング × レビュー数 + ランダム要素
        const ratingScore = store.avg_rating * 20; // 最大100点
        const reviewScore = Math.min(store.review_count / 10, 50); // 最大50点
        const randomBoost = Math.random() * 30; // 最大30点のランダム
        const totalScore = ratingScore + reviewScore + randomBoost;
        
        return {
            ...store,
            hotPickScore: totalScore
        };
    });

    // スコアでソートして上位5件を取得
    return storesWithScore
        .sort((a, b) => b.hotPickScore - a.hotPickScore)
        .slice(0, 5);
};

/**
 * Near By Youロジック：距離、お気に入り、レーティングで最大5件
 */
const getNearByStores = (stores, isLoggedIn, userFavorites = []) => {
    const storesWithScore = stores.map(store => {
        let score = 0;
        
        // 距離スコア（近いほど高得点）
        const distanceScore = Math.max(0, 100 - (store.distance * 10));
        score += distanceScore;
        
        // お気に入りボーナス（ログイン中のみ）
        if (isLoggedIn && userFavorites.includes(store.id)) {
            score += 150; // お気に入りは最優先
        }
        
        // レーティングスコア
        score += store.avg_rating * 10;
        
        // レビュー数スコア
        score += Math.min(store.review_count / 5, 20);
        
        return {
            ...store,
            nearByScore: score
        };
    });

    return storesWithScore
        .sort((a, b) => b.nearByScore - a.nearByScore)
        .slice(0, 5);
};

/**
 * Home Page - ホーム画面
 * Hot Pick + Near by you + All list を表示
 */
const HomePage = () => {
    const { stores } = useStoreData();
    const [currentHotPick, setCurrentHotPick] = useState(0);
    
    // ログイン状態を仮定（実際のアプリではuseAuthなどから取得）
    // 本番では useAuth() hook などから取得
    const isLoggedIn = true; // Mock: ログイン中と仮定
    const currentUserId = 1; // Mock: User ID 1
    const userFavorites = isLoggedIn ? MOCK_FAVORITES : [];

    // Hot Pick計算（メモ化）
    const hotPickStores = useMemo(() => getHotPickStores(stores), [stores]);

    //  Auto slide every 3s
    useEffect(() => {
        if (!hotPickStores || hotPickStores.length === 0) return;

        const interval = setInterval(() => {
            setCurrentHotPick((prev) => (prev + 1) % hotPickStores.length);
        }, 3000); // 3s

        return () => clearInterval(interval); // cleanup khi unmount
    }, [hotPickStores]);

    // Near By You計算（メモ化）
    const nearbyStores = useMemo(() => 
        getNearByStores(stores, isLoggedIn, userFavorites), 
        [stores, isLoggedIn, userFavorites]
    );

    // Hot Pickナビゲーション
    const nextHotPick = () => {
        setCurrentHotPick((prev) => (prev + 1) % hotPickStores.length);
    };

    const prevHotPick = () => {
        setCurrentHotPick((prev) =>
            prev === 0 ? hotPickStores.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:px-8 lg:px-12 max-w-7xl">
                {/* Hot Pick Section */}
                <section className="mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-coffee-dark">
                            おすすめ
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={prevHotPick}
                                className="h-8 w-8"
                                aria-label="前へ"
                            >
                                ←
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={nextHotPick}
                                className="h-8 w-8"
                                aria-label="次へ"
                            >
                                →
                            </Button>
                        </div>
                    </div>

                    {hotPickStores[currentHotPick] && (
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Images Grid */}
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    {hotPickStores[currentHotPick].images.slice(0, 3).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`overflow-hidden rounded-lg ${
                                                idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${hotPickStores[currentHotPick].name_jp} ${idx + 1}`}
                                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Info */}
                                <CardContent className="flex flex-col justify-center p-6">
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                                            {hotPickStores[currentHotPick].category}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold">
                                        {hotPickStores[currentHotPick].name_jp}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                                        {hotPickStores[currentHotPick].description_jp}
                                    </p>
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex items-center">
                                            <span className="text-lg font-bold text-amber-600">
                                                ★ {hotPickStores[currentHotPick].avg_rating}
                                            </span>
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                ({hotPickStores[currentHotPick].review_count}件)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="line-clamp-1">
                                            {hotPickStores[currentHotPick].address_jp}
                                        </span>
                                        <span className="ml-auto text-xs font-medium">
                                            {hotPickStores[currentHotPick].distance}km
                                        </span>
                                    </div>
                                    <Link to={`/store/${hotPickStores[currentHotPick].id}`}>
                                        <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                                            詳細を見る
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </div>
                        </Card>
                    )}

                    {/* Hot Pick indicators */}
                    <div className="mt-4 flex justify-center gap-2">
                        {hotPickStores.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentHotPick(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    idx === currentHotPick 
                                        ? "w-8 bg-amber-600" 
                                        : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                                aria-label={`スライド ${idx + 1} へ移動`}
                            />
                        ))}
                    </div>
                </section>

                {/* Near by you Section */}
                <section className="mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-coffee-dark">
                                近くのカフェ
                            </h2>
                            {isLoggedIn && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    お気に入りを優先表示しています
                                </p>
                            )}
                        </div>
                        <Link to="/map">
                            <Button variant="outline" className="gap-2">
                                <Map className="h-4 w-4" />
                                地図で見る
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {nearbyStores.map((store) => (
                            <StoreCard 
                                key={store.id} 
                                store={store}
                                isFavorite={userFavorites.includes(store.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* All List Section */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-coffee-dark">
                            すべてのカフェ
                        </h2>
                        <Link to="/search">
                            <Button variant="outline" className="gap-2">
                                もっと見る
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {stores.slice(0, 8).map((store) => (
                            <StoreCard 
                                key={store.id} 
                                store={store}
                                isFavorite={userFavorites.includes(store.id)}
                            />
                        ))}
                    </div>

                    {stores.length > 8 && (
                        <div className="mt-8 text-center">
                            <Link to="/search">
                                <Button size="lg" variant="outline" className="gap-2">
                                    さらに表示する ({stores.length - 8}件)
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePage;