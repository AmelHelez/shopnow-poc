export type TestOrder = { id: string; digits: string; label: string; kind: 'success' | 'outage' };

export const testOrders: TestOrder[] = [
  { id: 'SN-12345', digits: '4821', label: 'Shipped', kind: 'success' },
  { id: 'SN-67890', digits: '1379', label: 'Processing', kind: 'success' },
  { id: 'SN-24680', digits: '9054', label: 'Delivered', kind: 'success' },
  { id: 'SN-99999', digits: '0000', label: 'OMS unavailable', kind: 'outage' },
];