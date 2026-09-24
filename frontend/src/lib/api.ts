const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  retryAfterSeconds?: number;
}

/**
  * Global fetch wrapper for backend API calls.
  */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include httpOnly refresh cookie
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: body.error || res.statusText || 'API Error',
        message: body.message || body.error,
        details: body.details,
        retryAfterSeconds: body.retryAfterSeconds,
      };
    }

    return { data: body };
  } catch (err: any) {
    return {
      error: 'Network Error',
      message: err.message || 'Unable to connect to server',
    };
  }
}
