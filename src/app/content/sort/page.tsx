import BubbleSort from "@/components/sort/BubbleSort";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-2 py-10">
      <div className="grid gap-3">
        <h1 className="text-3xl">버블 정렬</h1>
        <BubbleSort count={9} />
      </div>
      <div></div>
    </div>
  );
}
