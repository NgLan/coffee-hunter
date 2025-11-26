// components/features/LoginPrompt.tsx
import React from 'react';
import styles from './ReviewForm.module.css';

type Props = {
  onClose: () => void;
  onLogin: () => void;
  onRegister?: () => void;
};

export const LoginPrompt: React.FC<Props> = ({ onClose, onLogin, onRegister }) => {
  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>ログインのご案内</div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
        </div>

        <p style={{ marginBottom: 12 }}>
          レビューを投稿するにはログインが必要です。<br />
          ログインまたは新規登録を行ってください。
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className={`${styles.btn} ${styles.ghost}`} onClick={onClose}>
            キャンセル
          </button>

          <button className={`${styles.btn} ${styles.primary}`} onClick={onLogin}>
            ログイン
          </button>

          {onRegister && (
            <button className={`${styles.btn} ${styles.ghost}`} onClick={onRegister}>
              新規登録
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
