export interface Medicine {
  id: string;
  name: string;
  arrivalDate: string;
  expiryDate: string;
  quantity: number;
  price: number;
  sales: number;
  supplier: string;
}

export const mockMedicines: Medicine[] = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    arrivalDate: "2024-01-15",
    expiryDate: "2026-01-15",
    quantity: 5000,
    price: 2.5,
    sales: 1200,
    supplier: "PharmaCorp Ltd"
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    arrivalDate: "2024-02-10",
    expiryDate: "2025-08-10",
    quantity: 3500,
    price: 8.75,
    sales: 850,
    supplier: "MediSupply Inc"
  },
  {
    id: "MED003",
    name: "Ibuprofen 400mg",
    arrivalDate: "2024-03-05",
    expiryDate: "2026-03-05",
    quantity: 4200,
    price: 3.25,
    sales: 1450,
    supplier: "PharmaCorp Ltd"
  },
  {
    id: "MED004",
    name: "Omeprazole 20mg",
    arrivalDate: "2024-01-20",
    expiryDate: "2025-07-20",
    quantity: 2800,
    price: 6.5,
    sales: 920,
    supplier: "HealthDist Co"
  },
  {
    id: "MED005",
    name: "Metformin 500mg",
    arrivalDate: "2024-02-28",
    expiryDate: "2026-02-28",
    quantity: 3900,
    price: 4.75,
    sales: 1100,
    supplier: "MediSupply Inc"
  },
  {
    id: "MED006",
    name: "Aspirin 75mg",
    arrivalDate: "2024-03-12",
    expiryDate: "2026-09-12",
    quantity: 6000,
    price: 1.5,
    sales: 2100,
    supplier: "PharmaCorp Ltd"
  },
  {
    id: "MED007",
    name: "Lisinopril 10mg",
    arrivalDate: "2024-01-08",
    expiryDate: "2025-06-08",
    quantity: 2200,
    price: 7.25,
    sales: 650,
    supplier: "HealthDist Co"
  },
  {
    id: "MED008",
    name: "Atorvastatin 20mg",
    arrivalDate: "2024-02-15",
    expiryDate: "2026-02-15",
    quantity: 3100,
    price: 9.5,
    sales: 780,
    supplier: "MediSupply Inc"
  }
];
