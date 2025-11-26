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

    const allowedExtensions = /\.(jpe?g|png)$/i;
    const maxSize = 5 * 1024 * 1024; // 5MB

    // temp container no longer required since we use Promise.all
    const maxSlots = 3 - images.length;
    if (maxSlots <= 0) {
      setError('画像は最大3枚までです。');
      return;
    }

    const readPromises: Promise<string>[] = [];
    let queued = 0;

    for (let i = 0; i < files.length && queued < maxSlots; i++) {
      const f = files[i];

      // Validate file extension
      if (!allowedExtensions.test(f.name)) {
        setError('画像はjpg、jpeg、png形式でなければなりません。');
        continue; // skip invalid file
      }

      // Validate file size
      if (f.size > maxSize) {
        setError('画像のサイズは5MB未満である必要があります。');
        continue; // skip large file
      }

      queued++;
      readPromises.push(
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') resolve(ev.target.result);
            else resolve('');
          };
          reader.readAsDataURL(f);
        })
      );
    }

    if (readPromises.length === 0) return;

    Promise.all(readPromises).then((dataUrls) => {
      setImages((prev) => [...prev, ...dataUrls].slice(0, 3));
      setError('');
      // reset file input so user can select same file again if needed
      if (fileRef.current) fileRef.current.value = '';
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateAndSubmit = () => {
    if (rating < 1) return setError('星評価を1つ以上選択してください。');
    if (comment.trim().length < 20) return setError('コメントは20文字以上で入力してください。');

    setError('');
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
          <label className={styles.label}>画像を選択</label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleChooseImage}
            />
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
                <button className={`${styles.btn} ${styles.ghost} ${styles.cancel}`} onClick={onClose}>キャンセル</button>
                <button className={`${styles.btn} ${styles.primary}`} onClick={validateAndSubmit}>送信</button>
              </div>

      </div>
    </div>
  );
};
