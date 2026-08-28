import { useEffect, useState } from "react";
import { createCard, deleteCard, getCards, updateCard } from "./api/cards";
import CardItem from "./components/CardItem";
import CardModal from "./components/CardModal";
import DeleteModal from "./components/DeleteModal";

const emptyForm = { title: "", content: "", password: "" };

function withoutPassword(card) {
  if (!card || typeof card !== "object") return card;
  const { password: _password, ...rest } = card;
  return rest;
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  async function loadCards() {
    try {
      setError("");
      const data = await getCards();
      setCards((Array.isArray(data) ? data : []).map(withoutPassword));
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
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(card) {
    setEditing(card);
    setForm({ title: card.title, content: card.content, password: "" });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setEditing(null);
    setFormError("");
  }

  function openDelete(card) {
    setDeleting(card);
    setDeletePassword("");
    setFormError("");
  }

  function closeDelete() {
    setDeleting(null);
    setDeletePassword("");
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      title: form.title,
      content: form.content,
      password: form.password,
    };

    try {
      if (editing) {
        const updated = await updateCard(editing.id, payload);
        setCards((prev) =>
          prev.map((card) => (card.id === updated.id ? withoutPassword(updated) : card)),
        );
      } else {
        const created = await createCard(payload);
        setCards((prev) => [withoutPassword(created), ...prev]);
      }
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    if (!deleting) return;

    setDeleteSaving(true);
    setFormError("");

    try {
      await deleteCard(deleting.id, deletePassword);
      setCards((prev) => prev.filter((item) => item.id !== deleting.id));
      closeDelete();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setDeleteSaving(false);
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
                onDelete={openDelete}
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
        error={formError}
        onChange={setForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        open={Boolean(deleting)}
        card={deleting}
        password={deletePassword}
        saving={deleteSaving}
        error={formError}
        onPasswordChange={setDeletePassword}
        onClose={closeDelete}
        onSubmit={handleDelete}
      />
    </div>
  );
}
