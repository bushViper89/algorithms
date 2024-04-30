"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { delay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  count: number;
}

type Container = HTMLUListElement | null;
type List = { key: number; value: number }[];
type Target = HTMLLIElement | null | undefined;

const item: {
  class: {
    active: string[];
    disabled: string[];
  };
  delay: number;
  id: string;
  gap: string;
  width: string;
} = {
  class: {
    active: ["bg-blue-200"],
    disabled: ["bg-slate-200"],
  },
  delay: 500,
  id: "bubble-item-",
  gap: "10px",
  width: "60px",
};

const BubbleSort = ({ count }: Props) => {
  const containerRef = useRef<Container>(null);
  const [list, setList] = useState<List>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const initialize = useCallback(() => {
    setProgress(0);

    const arr = new Array(count).fill(null).map((_, idx) => {
      if (list.length) {
        const el = document.getElementById(`${item.id}${idx}`);

        if (el) {
          el.classList.remove(...item.class.disabled);
          el.style.width = item.width;
          el.style.left = `calc(${item.width} * ${idx} + ${item.gap} * ${idx})`;
        }
      }

      return {
        key: idx,
        value: Math.floor(Math.random() * 1000),
      };
    });

    setList(arr);
  }, [count, list]);

  const sortBubble = useCallback(async (arr: List) => {
    setIsPending(true);

    const container: Container = containerRef.current;

    for (let max = arr.length - 1; max > 0; max--) {
      for (let idx = 0; idx < max; idx++) {
        const target: Target = container?.querySelector(
          `#${item.id}${arr[idx].key}`
        );
        const compareTarget: Target = container?.querySelector(
          `#${item.id}${arr[idx + 1].key}`
        );
        const bol = arr[idx].value > arr[idx + 1].value;

        if (target && compareTarget) {
          container &&
            container.parentElement &&
            (container.parentElement.scrollLeft = target.offsetLeft);

          target.classList.add(...item.class.active);
          compareTarget.classList.add(...item.class.active);

          await delay(item.delay);

          if (bol) {
            [target.style.left, compareTarget.style.left] = [
              compareTarget.style.left,
              target.style.left,
            ];

            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
          }

          await delay(item.delay);

          target.classList.remove(...item.class.active);
          compareTarget.classList.remove(...item.class.active);

          await delay(item.delay);

          if (max === idx + 1) {
            bol
              ? target.classList.add(...item.class.disabled)
              : compareTarget.classList.add(...item.class.disabled);

            if (max === 1) {
              target.classList.add(...item.class.disabled);
              compareTarget.classList.add(...item.class.disabled);
            }

            setProgress(((arr.length - max) / (arr.length - 1)) * 100);
            await delay(item.delay);
          }
        }
      }
    }

    setIsPending(false);
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="grid gap-3 w-full">
      <div className="flex items-center gap-2">
        <div>진행률</div>
        <div className="grow">
          <Progress value={progress} />
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <ul ref={containerRef} className="relative select-none w-full h-16">
          {list?.map((obj, idx) => {
            return (
              <li
                id={`${item.id}${obj.key}`}
                key={`${item.id}${obj.key}`}
                style={{
                  width: item.width,
                  left: `calc(${item.width} * ${idx} + ${item.gap} * ${idx})`,
                }}
                className="transition-all duration-700 absolute grid place-content-center aspect-[1/1] border shadow-md rounded"
              >
                {obj.value}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isPending} onClick={initialize}>
          초기화
        </Button>
        <Button disabled={isPending} onClick={() => sortBubble([...list])}>
          정렬
        </Button>
      </div>
    </div>
  );
};

export default BubbleSort;
