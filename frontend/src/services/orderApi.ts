export type OrderStatusResponse = {
  orderId: string;
  status: string;
  estimatedDelivery: string | null;
  message: string;
};

export class OrderLookupError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'OrderLookupError';
  }
}

export async function lookupOrder(orderId: string, phoneLast4: string): Promise<OrderStatusResponse> {
  const response = await fetch('/api/demo/order-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, phoneLast4 }),
  });

  let payload: unknown;

  try {
    payload = await response.json();
  }
  catch {
    payload = null;
  }
  const data = payload as { message?: string } | null;

  if (!response.ok) {
    throw new OrderLookupError(response.status, data?.message ?? 'Unexpected server response.');
  }

  return payload as OrderStatusResponse;
}