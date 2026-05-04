const API_BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
const API_KEY = '87909682e6cd74208f41a6ef39fe4191';

interface RequestOptions {
  method?: string;
  body?: unknown;
}

function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, config).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.message || `API Error: ${response.status}`);
      });
    }
    return response.json();
  });
}

export function getProducts(options: {
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<unknown> {
  const params = new URLSearchParams();
  if (options.search) params.set('search', options.search);
  if (options.limit) params.set('limit', String(options.limit));
  if (options.offset) params.set('offset', String(options.offset));

  const query = params.toString();
  const endpoint = `/products${query ? `?${query}` : ''}`;
  return request(endpoint);
}

export function getProductById(id: string): Promise<unknown> {
  return request(`/products/${id}`);
}