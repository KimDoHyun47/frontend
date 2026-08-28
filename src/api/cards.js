const API_URL = (import.meta.env.API_URL || "http://localhost:4000").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("백엔드에 연결하지 못했습니다. 서버와 API 주소를 확인해 주세요.");
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }

  return data;
}

export function getCards() {
  return request("/api/cards");
}

export function createCard(payload) {
  return request("/api/cards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCard(id, payload) {
  return request(`/api/cards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCard(id) {
  return request(`/api/cards/${id}`, {
    method: "DELETE",
  });
}
