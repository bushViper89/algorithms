"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { itemOptions } from "@/app/constant/sort";
import { delay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SortItem from "@/components/sort/SortItem";

interface Props {
  count: number;
}

type Container = HTMLDivElement | null;
type List = { key: number; value: number }[];
type Target = HTMLDivElement | null | undefined;

const BubbleSort = ({ count }: Props) => {
  const containerRef = useRef<Container>(null);
  const [list, setList] = useState<List>([]);
  const [isComplete, setIsComplte] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const itemOpt = useMemo(
    () => ({
      ...itemOptions,
      id: "bubble-item-",
    }),
    []
  );

  const initialize = useCallback(() => {
    setIsComplte(false);
    setProgress(0);

    const arr = new Array(count).fill(null).map((_, idx) => {
      if (list.length) {
        const el = document.getElementById(`${itemOpt.id}${idx}`);

        if (el) {
          el.classList.remove(...itemOpt.class.complete);
          el.style.width = itemOpt.width;
          el.style.left = `calc(${itemOpt.width} * ${idx} + ${itemOpt.gap} * ${idx})`;
        }
      }

      return {
        key: idx,
        value: Math.floor(Math.random() * 1000),
      };
    });

    setList(arr);
  }, [count, itemOpt, list]);

  const sortBubble = useCallback(
    async (arr: List) => {
      setIsPending(true);

      const container: Container = containerRef.current;
      const maxIndex = arr.length - 1;

      for (let lastIndex = maxIndex; lastIndex > 0; lastIndex--) {
        for (let pointer = 0; pointer < lastIndex; pointer++) {
          const target: Target = container?.querySelector(
            `#${itemOpt.id}${arr[pointer].key}`
          );
          const compareTarget: Target = container?.querySelector(
            `#${itemOpt.id}${arr[pointer + 1].key}`
          );
          const isChange = arr[pointer].value > arr[pointer + 1].value;

          if (target && compareTarget) {
            target.classList.add(...itemOpt.class.compare);
            compareTarget.classList.add(...itemOpt.class.compare);

            await delay(itemOpt.delay);

            if (isChange) {
              [target.style.left, compareTarget.style.left] = [
                compareTarget.style.left,
                target.style.left,
              ];

              [arr[pointer], arr[pointer + 1]] = [
                arr[pointer + 1],
                arr[pointer],
              ];
            }

            await delay(itemOpt.delay);

            target.classList.remove(...itemOpt.class.compare);
            compareTarget.classList.remove(...itemOpt.class.compare);

            await delay(itemOpt.delay);

            if (lastIndex === pointer + 1) {
              isChange
                ? target.classList.add(...itemOpt.class.complete)
                : compareTarget.classList.add(...itemOpt.class.complete);

              if (lastIndex === 1) {
                target.classList.add(...itemOpt.class.complete);
                compareTarget.classList.add(...itemOpt.class.complete);
              }

              setProgress(((arr.length - lastIndex) / maxIndex) * 100);
              await delay(itemOpt.delay);
            }
          }
        }
      }

      setIsComplte(true);
      setIsPending(false);
    },
    [itemOpt]
  );

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="grid gap-2 w-full">
      <div className="flex items-center gap-2">
        <div>진행률</div>
        <div className="grow">
          <Progress value={progress} />
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <div ref={containerRef} className="relative select-none w-full h-16">
          {list?.map((obj, idx) => {
            return (
              <SortItem
                id={`${itemOpt.id}${obj.key}`}
                key={`${itemOpt.id}${obj.key}`}
                style={{
                  width: itemOpt.width,
                  left: `calc(${itemOpt.width} * ${idx} + ${itemOpt.gap} * ${idx})`,
                }}
                className="transition-all duration-700 absolute grid place-content-center aspect-[1/1] border shadow-md rounded"
              >
                {obj.value}
              </SortItem>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isPending} onClick={initialize}>
          초기화
        </Button>
        <Button
          disabled={isPending || isComplete}
          onClick={() => sortBubble([...list])}
        >
          정렬
        </Button>
      </div>
    </div>
  );
};

export default BubbleSort;
