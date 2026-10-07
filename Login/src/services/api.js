import { getToken } from "../utils/auth";

const API =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost/App/backend/public/api";

async function request(method, path, body) {
    const headers = { Accept: "application/json" };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Server returned invalid response (HTTP ${res.status}). Check VITE_API_BASE_URL (${API}).`);
    }

    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

export const api = {
    get: (p) => request("GET", p),
    post: (p, b = {}) => request("POST", p, b),
    put: (p, b = {}) => request("PUT", p, b),
    del: (p) => request("DELETE", p),
};

const qs = (obj) => {
    const p = new URLSearchParams();
    Object.entries(obj || {}).forEach(([k, v]) => v !== "" && v != null && p.set(k, v));
    const s = p.toString();
    return s ? `?${s}` : "";
};

export const profileApi = {
    get: () => api.get("/profile"),
    update: (d) => api.put("/profile", d),
    changePassword: (d) => api.put("/profile/password", d),
};
export const usersApi = {
    list: (f) => api.get(`/users${qs(f)}`),
    create: (d) => api.post("/users", d),
    update: (id, d) => api.put(`/users/${id}`, d),
    remove: (id) => api.del(`/users/${id}`),
};
export const coursesApi = {
    list: () => api.get("/courses"),
    get: (id) => api.get(`/courses/${id}`),
    create: (d) => api.post("/courses", d),
    update: (id, d) => api.put(`/courses/${id}`, d),
    remove: (id) => api.del(`/courses/${id}`),
};
export const batchesApi = {
    list: (f) => api.get(`/batches${qs(f)}`),
    create: (d) => api.post("/batches", d),
    update: (id, d) => api.put(`/batches/${id}`, d),
    remove: (id) => api.del(`/batches/${id}`),
};
export const paymentsApi = {
    createOrder: (d) => api.post("/payments/create-order", d),
    verify: (d) => api.post("/payments/verify", d),
    myCourses: () => api.get("/my-courses"),
};
export const purchasesApi = {
    list: (f) => api.get(`/purchases${qs(f)}`),
};

export const assignmentsApi = {
    list: (f) => api.get(`/assignments${qs(f)}`),
    staff: () => api.get("/staff-list"),
    create: (d) => api.post("/assignments", d),
    update: (id, d) => api.put(`/assignments/${id}`, d),
    remove: (id) => api.del(`/assignments/${id}`),
};
export const staffApi = {
    dashboard: () => api.get("/staff/dashboard"),
    students: (assignmentId) => api.get(`/staff/students${qs({ assignment_id: assignmentId })}`),
    attendance: (assignmentId, date) => api.get(`/staff/attendance${qs({ assignment_id: assignmentId, date })}`),
    saveAttendance: (d) => api.post("/staff/attendance", d),
    summary: (assignmentId) => api.get(`/staff/attendance/summary${qs({ assignment_id: assignmentId })}`),
};
export const studentApi = {
    attendance: () => api.get("/my-attendance"),
    batches: () => api.get("/my-batches"),
};
export const leavesApi = {
    create: (d) => api.post("/leaves", d),
    mine: () => api.get("/leaves/mine"),
    inbox: (f) => api.get(`/leaves/inbox${qs(f)}`),
    review: (id, d) => api.put(`/leaves/${id}/review`, d),
    cancel: (id) => api.del(`/leaves/${id}`),
};
export const diagnoseRazorpay = () => api.get("/payments/diagnose");
