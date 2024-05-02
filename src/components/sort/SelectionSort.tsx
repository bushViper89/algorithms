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

const SelectionSort = ({ count }: Props) => {
  const containerRef = useRef<Container>(null);
  const [list, setList] = useState<List>([]);
  const [isComplete, setIsComplte] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const itemOpt = useMemo(
    () => ({
      ...itemOptions,
      id: "select-item-",
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

  const sortSelection = useCallback(
    async (arr: List) => {
      setIsPending(true);

      const container: Container = containerRef.current;
      const lastIndex = arr.length - 1;

      for (let pointer = 0; pointer <= lastIndex; pointer++) {
        const compare = pointer + 1;
        let selected = pointer;

        for (let idx = compare; idx <= lastIndex; idx++) {
          const target: Target = container?.querySelector(
            `#${itemOpt.id}${arr[selected].key}`
          );
          const compareTarget: Target = container?.querySelector(
            `#${itemOpt.id}${arr[idx].key}`
          );

          if (target && compareTarget) {
            target.classList.add(...itemOpt.class.compare);
            compareTarget.classList.add(...itemOpt.class.compare);

            await delay(itemOpt.delay);

            if (arr[selected].value > arr[idx].value) {
              target.classList.remove(...itemOpt.class.seleted);
              compareTarget.classList.add(...itemOpt.class.seleted);

              selected = idx;
            } else {
              target.classList.add(...itemOpt.class.seleted);
              compareTarget.classList.remove(...itemOpt.class.seleted);
            }

            await delay(itemOpt.delay);

            target.classList.remove(...itemOpt.class.compare);
            compareTarget.classList.remove(...itemOpt.class.compare);
          }
        }

        const pointerTarget: Target = container?.querySelector(
          `#${itemOpt.id}${arr[pointer].key}`
        );
        const selectedTarget: Target = container?.querySelector(
          `#${itemOpt.id}${arr[selected].key}`
        );

        if (pointerTarget && selectedTarget) {
          await delay(itemOpt.delay);

          [arr[pointer], arr[selected]] = [arr[selected], arr[pointer]];
          [pointerTarget.style.left, selectedTarget.style.left] = [
            selectedTarget.style.left,
            pointerTarget.style.left,
          ];

          await delay(itemOpt.delay);

          selectedTarget.classList.add(...itemOpt.class.complete);
          selectedTarget.classList.remove(...itemOpt.class.seleted);

          setProgress(((pointer + 1) / (lastIndex + 1)) * 100);

          await delay(itemOpt.delay);
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
