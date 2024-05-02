import BubbleSort from "@/components/sort/BubbleSort";
import SelectionSort from "@/components/sort/SelectionSort";

export default function Page() {
  return (
    <div className="grid gap-4 py-10 lg:grid-cols-2">
      <div className="grid gap-2">
        <h1 className="text-3xl">버블 정렬</h1>
        <BubbleSort count={8} />
      </div>
      <div className="grid gap-2">
        <h1 className="text-3xl">선택 정렬</h1>
        <SelectionSort count={8} />
      </div>
    </div>
  );
}
