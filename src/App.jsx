import { useEffect, useState } from "react";
import { createCard, deleteCard, getCards, updateCard } from "./api/cards";
import CardItem from "./components/CardItem";
import CardModal from "./components/CardModal";

const emptyForm = { title: "", content: "" };

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadCards() {
    try {
      setError("");
      const data = await getCards();
      setCards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(card) {
    setEditing(card);
    setForm({ title: card.title, content: card.content });
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editing) {
        const updated = await updateCard(editing.id, form);
        setCards((prev) => prev.map((card) => (card.id === updated.id ? updated : card)));
      } else {
        const created = await createCard(form);
        setCards((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(card) {
    const confirmed = window.confirm(`"${card.title}" 카드를 삭제할까요?`);
    if (!confirmed) return;

    try {
      await deleteCard(card.id);
      setCards((prev) => prev.filter((item) => item.id !== card.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200/80 bg-[#f4f1ea]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-700">BOARD</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">카드 게시판</h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800"
          >
            새 카드
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadCards();
              }}
              className="shrink-0 rounded-full bg-white px-3 py-1 font-medium text-rose-700 hover:bg-rose-100"
            >
              다시 시도
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-stone-500">카드를 불러오는 중...</p>
        ) : cards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/60 px-8 py-16 text-center">
            <p className="text-lg font-medium">아직 카드가 없습니다</p>
            <p className="mt-2 text-sm text-stone-500">첫 번째 카드를 만들어 게시판을 채워 보세요.</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
            >
              카드 작성
            </button>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </main>

      <CardModal
        open={modalOpen}
        mode={editing ? "edit" : "create"}
        form={form}
        saving={saving}
        onChange={setForm}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
