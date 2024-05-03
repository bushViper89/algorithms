import BubbleSort from "@/components/sort/BubbleSort";
import InsertionSort from "@/components/sort/InsertionSort";
import SelectionSort from "@/components/sort/SelectionSort";

export default function Page() {
  return (
    <div className="grid gap-4 py-10 lg:grid-cols-2">
      <div className="grid gap-2 border rounded p-4">
        <h1 className="text-3xl">버블 정렬</h1>
        <BubbleSort count={8} />
      </div>
      <div className="grid gap-2 border rounded p-4">
        <h1 className="text-3xl">선택 정렬</h1>
        <SelectionSort count={8} />
      </div>

      <div className="grid gap-2 border rounded p-4">
        <h1 className="text-3xl">삽입 정렬</h1>
        <InsertionSort count={8} />
      </div>
    </div>
  );
}
