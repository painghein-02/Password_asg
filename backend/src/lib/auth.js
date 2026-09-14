// Validates the custom headers injected by your JWT proxy
export function isAdmin(request) {
  const id = request.headers.get("x-user-id");
  return id === "-1";
}

export function isAuth(request) {
  const id = request.headers.get("x-user-id");
  return !!id;
}
