export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
}