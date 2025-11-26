// components/features/ReviewForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './ReviewForm.module.css';

export type ReviewPayload = {
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  author?: string;
};

type Props = {
  onClose: () => void;
  onSubmit: (payload: ReviewPayload) => void;
  authorName?: string;
};

export const ReviewForm: React.FC<Props> = ({ onClose, onSubmit, authorName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError('');
  }, [rating, comment]);

  const handleChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const out: string[] = [];
    const limit = Math.min(files.length, 3);
    let done = 0;

    for (let i = 0; i < limit; i++) {
      const f = files[i];
      const reader = new FileReader();

      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') out.push(ev.target.result);
        done++;

        if (done === limit) {
          setImages((prev) => [...prev, ...out].slice(0, 3));
        }
      };

      reader.readAsDataURL(f);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateAndSubmit = () => {
    if (rating < 1) return setError('星評価を1つ以上選択してください。');
    if (comment.trim().length < 5) return setError('コメントは5文字以上で入力してください。');

    onSubmit({
      rating,
      comment: comment.trim(),
      images,
      createdAt: new Date().toISOString(),
      author: authorName || '匿名',
    });

    onClose();
  };

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>レビューを投稿</div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
        </div>

        {/* Rating */}
        <div className={styles.row}>
          <label className={styles.label}>星評価</label>
          <div className={styles.starRow} onMouseLeave={() => setHover(0)}>
            {[1,2,3,4,5].map((v) => {
              const active = v <= (hover || rating);
              return (
                <button
                  key={v}
                  type="button"
                  className={`${styles.starBtn} ${active ? styles.selected : ''}`}
                  onMouseEnter={() => setHover(v)}
                  onClick={() => setRating(v)}
                >
                  {active ? '★' : '☆'} {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div className={styles.row}>
          <label className={styles.label}>コメント</label>
          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="お店の感想を入力してください..."
          />
        </div>

        {/* Images */}
        <div className={styles.row}>
          <label className={styles.label}>画像を選択（モック）</label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleChooseImage}
            />
            <span style={{ fontSize: 13, color: '#666' }}>
              ※ 実際のアップロードは行われません。サムネイルのみ表示します。
            </span>
          </div>

          {images.length > 0 && (
            <div className={styles.imagePreviewRow}>
              {images.map((src, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={src} alt="preview" className={styles.thumb} />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    aria-label="画像を削除"
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      padding: '2px 6px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Actions */}
        <div className={styles.controls}>
          <button className={`${styles.btn} ${styles.ghost}`} onClick={onClose}>キャンセル</button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={validateAndSubmit}>送信</button>
        </div>

      </div>
    </div>
  );
};
