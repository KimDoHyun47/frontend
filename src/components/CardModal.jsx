import { useEffect } from "react";

export default function CardModal({
  open,
  mode,
  form,
  saving,
  error,
  onChange,
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

  if (!open) return null;

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
        <h2 className="text-xl font-semibold tracking-tight">
          {mode === "edit" ? "카드 수정" : "새 카드"}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {mode === "edit"
            ? "수정하려면 등록 시 정한 비밀번호가 필요합니다."
            : "제목, 내용, 비밀번호를 작성해 주세요."}
        </p>

        {error && (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-stone-700">
          제목
          <input
            autoFocus
            value={form.title}
            onChange={(event) => onChange({ ...form, title: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="예: 오늘 할 일"
            maxLength={80}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          내용
          <textarea
            value={form.content}
            onChange={(event) => onChange({ ...form, content: event.target.value })}
            className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder="카드에 남길 내용을 입력하세요."
            maxLength={2000}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          비밀번호
          <input
            type="password"
            autoComplete="off"
            value={form.password}
            onChange={(event) => onChange({ ...form, password: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            placeholder={mode === "edit" ? "등록 시 정한 비밀번호" : "카드 비밀번호"}
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
            disabled={saving || !form.title.trim() || !form.password}
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
