import { useEffect } from "react";

export default function DeleteModal({
  open,
  card,
  password,
  saving,
  error,
  onPasswordChange,
  onClose,
  onSubmit,
}) {
  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-semibold tracking-tight">카드 삭제</h2>
        <p className="mt-1 text-sm text-stone-500">
          &ldquo;{card.title}&rdquo; 카드를 삭제하려면 등록 시 정한 비밀번호를 입력해 주세요.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-stone-700">
          비밀번호
          <input
            autoFocus
            type="password"
            autoComplete="off"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="비밀번호"
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving || !password}
            className="rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </form>
    </div>
  );
}
