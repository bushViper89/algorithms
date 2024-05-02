interface ItemOptions {
  class: {
    compare: string[];
    complete: string[];
    seleted: string[];
  };
  delay: number;
  id: string;
  gap: string;
  width: string;
}

export const itemOptions: ItemOptions = {
  class: {
    compare: ["bg-yellow-200"],
    complete: ["bg-slate-200"],
    seleted: ["border-blue-600", "border-4"],
  },
  delay: 500,
  id: "",
  gap: "10px",
  width: "60px",
};
