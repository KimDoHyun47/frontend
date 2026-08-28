function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function CardItem({ card, onEdit, onDelete }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_12px_30px_-18px_rgba(28,25,23,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(28,25,23,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-stone-900">
          {card.title}
        </h3>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
          {formatDate(card.createdAt)}
        </span>
      </div>
      <p className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-6 text-stone-600">
        {card.content || "내용이 없습니다."}
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(card)}
          className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-200"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(card)}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          삭제
        </button>
      </div>
    </article>
  );
}
