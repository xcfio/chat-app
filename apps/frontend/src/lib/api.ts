// src/lib/api.ts
import axios from "axios"
import { User, Conversation, Message } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:7200"

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
})

// Auth endpoints
export const auth = {
    me: () => api.get<User>("/auth/me"),
    refresh: () => api.post<User>("/auth/refresh"),
    logout: () => api.post<{ success: boolean; message: string }>("/auth/logout"),
    githubLogin: () => `${API_BASE}/auth/github`,
    googleLogin: () => `${API_BASE}/auth/google`
}

// User endpoints
export const users = {
    getAll: (page = 1, limit = 20, search?: string) => api.get<User[]>("/user", { params: { page, limit, search } }),
    getById: (id: string) => api.get<User>(`/user/${id}`),
    search: (query: string, limit = 10) => api.get<User[]>("/search/users", { params: { query, limit } })
}

// Conversation endpoints
export const conversations = {
    getAll: (page = 1, limit = 20) => api.get<Conversation[]>("/conversations", { params: { page, limit } }),
    getById: (id: string) => api.get<Conversation>(`/conversations/${id}`),
    create: (userId: string) => api.post<Conversation>(`/conversations/${userId}`),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/conversations/${id}`)
}

// Message endpoints
export const messages = {
    getByConversation: (conversationId: string, page = 1, limit = 50, before?: string) =>
        api.get<Message[]>(`/conversations/${conversationId}/messages`, {
            params: { page, limit, before }
        }),
    send: (conversationId: string, content: string) =>
        api.post<Message>(`/conversations/${conversationId}/messages`, { content }),
    edit: (id: string, content: string) =>
        api.patch<{ success: boolean; message: string; data: Partial<Message> }>(`/messages/${id}`, { content }),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/messages/${id}`),
    markAsRead: (id: string) => api.put<{ success: boolean; message: string }>(`/messages/${id}/read`),
    search: (query: string, limit = 20, conversationId?: string) =>
        api.get<Message[]>("/search/messages", {
            params: { query, limit, conversationId }
        })
}

export default api
