"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { itemOptions } from "@/app/constant/sort";
import { delay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SortItem from "@/components/sort/SortItem";
import { Progress } from "@/components/ui/progress";

interface Props {
  count: number;
}

type Container = HTMLDivElement | null;
type List = { key: number; value: number }[];
type Target = HTMLDivElement | null | undefined;

itemOptions.id = "select-item-";

const SelectionSort = ({ count }: Props) => {
  const containerRef = useRef<Container>(null);
  const [list, setList] = useState<List>([]);
  const [isComplete, setIsComplte] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const initialize = useCallback(() => {
    setIsComplte(false);
    setProgress(0);

    const arr = new Array(count).fill(null).map((_, idx) => {
      if (list.length) {
        const el = document.getElementById(`${itemOptions.id}${idx}`);

        if (el) {
          el.classList.remove(...itemOptions.class.complete);
          el.style.width = itemOptions.width;
          el.style.left = `calc(${itemOptions.width} * ${idx} + ${itemOptions.gap} * ${idx})`;
        }
      }

      return {
        key: idx,
        value: Math.floor(Math.random() * 1000),
      };
    });

    setList(arr);
  }, [count, list]);

  const sortSelection = useCallback(async (arr: List) => {
    setIsPending(true);

    const container: Container = containerRef.current;
    const lastIndex = arr.length - 1;

    for (let pointer = 0; pointer <= lastIndex; pointer++) {
      const compare = pointer + 1;
      let selected = pointer;

      for (let idx = compare; idx <= lastIndex; idx++) {
        const target: Target = container?.querySelector(
          `#${itemOptions.id}${arr[selected].key}`
        );
        const compareTarget: Target = container?.querySelector(
          `#${itemOptions.id}${arr[idx].key}`
        );

        if (target && compareTarget) {
          target.classList.add(...itemOptions.class.compare);
          compareTarget.classList.add(...itemOptions.class.compare);

          await delay(itemOptions.delay);

          if (arr[selected].value > arr[idx].value) {
            target.classList.remove(...itemOptions.class.seleted);
            compareTarget.classList.add(...itemOptions.class.seleted);

            selected = idx;
          } else {
            target.classList.add(...itemOptions.class.seleted);
            compareTarget.classList.remove(...itemOptions.class.seleted);
          }

          await delay(itemOptions.delay);

          target.classList.remove(...itemOptions.class.compare);
          compareTarget.classList.remove(...itemOptions.class.compare);
        }
      }

      const pointerTarget: Target = container?.querySelector(
        `#${itemOptions.id}${arr[pointer].key}`
      );
      const selectedTarget: Target = container?.querySelector(
        `#${itemOptions.id}${arr[selected].key}`
      );

      if (pointerTarget && selectedTarget) {
        await delay(itemOptions.delay);

        [arr[pointer], arr[selected]] = [arr[selected], arr[pointer]];
        [pointerTarget.style.left, selectedTarget.style.left] = [
          selectedTarget.style.left,
          pointerTarget.style.left,
        ];

        await delay(itemOptions.delay);

        selectedTarget.classList.add(...itemOptions.class.complete);
        selectedTarget.classList.remove(...itemOptions.class.seleted);

        setProgress(((pointer + 1) / (lastIndex + 1)) * 100);

        await delay(itemOptions.delay);
      }
    }

    setIsComplte(true);
    setIsPending(false);
  }, []);

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
                id={`${itemOptions.id}${obj.key}`}
                key={`${itemOptions.id}${obj.key}`}
                style={{
                  width: itemOptions.width,
                  left: `calc(${itemOptions.width} * ${idx} + ${itemOptions.gap} * ${idx})`,
                }}
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
          onClick={() => sortSelection([...list])}
        >
          정렬
        </Button>
      </div>
    </div>
  );
};

export default SelectionSort;
