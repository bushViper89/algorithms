"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { itemOptions } from "@/app/constant/sort";
import { delay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SortItem from "@/components/sort/SortItem";
import { Target } from "lucide-react";

interface Props {
  count: number;
}

type Container = HTMLDivElement | null;
type List = { key: number; value: number }[];
type Target = HTMLDivElement | null | undefined;

const InsertionSort = ({ count }: Props) => {
  const containerRef = useRef<Container>(null);
  const [list, setList] = useState<List>([]);
  const [isComplete, setIsComplte] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const itemOpt = useMemo(
    () => ({
      ...itemOptions,
      id: "insertion-item-",
    }),
    []
  );

  const initialize = useCallback(() => {
    setIsComplte(false);
    setProgress(0);

    const blankTarget = document.getElementById(`${itemOpt.id}blank`);
    if (blankTarget) {
      blankTarget.style.top = "0";
      blankTarget.style.left = "0";
    }

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

  const lastChange = useCallback(
    async (target: Target, changeTaget: Target) => {
      if (target && changeTaget) {
        [target.style.left, changeTaget.style.left] = [
          changeTaget.style.left,
          target.style.left,
        ];
        await delay(itemOpt.delay);
        [target.style.top, changeTaget.style.top] = [
          changeTaget.style.top,
          target.style.top,
        ];
        await delay(itemOpt.delay);
        target.classList.remove(...itemOpt.class.compare);
        target.classList.add(...itemOpt.class.complete);
      }
    },
    [itemOpt]
  );

  const sortInsertion = useCallback(
    async (arr: List) => {
      setIsPending(true);

      const container: Container = containerRef.current;
      const lastIndex = arr.length - 1;
      const blankTarget: Target = container?.querySelector(
        `#${itemOpt.id}blank`
      );

      container
        ?.querySelector(`#${itemOpt.id}0`)
        ?.classList.add(...itemOpt.class.complete);

      await delay(itemOpt.delay);

      setProgress((1 / (lastIndex + 1)) * 100);

      for (let pointer = 1; pointer <= lastIndex; pointer++) {
        const maxIndex = pointer - 1;
        let curIndex = pointer;

        const curTarget: Target = container?.querySelector(
          `#${itemOpt.id}${arr[curIndex].key}`
        );

        if (blankTarget && curTarget) {
          [blankTarget.style.top, curTarget.style.top] = [
            curTarget.style.top,
            blankTarget.style.top,
          ];
          await delay(itemOpt.delay);
          [blankTarget.style.left, curTarget.style.left] = [
            curTarget.style.left,
            "0",
          ];
          await delay(itemOpt.delay);
          curTarget.classList.add(...itemOpt.class.compare);
          await delay(itemOpt.delay);

          for (let compare = maxIndex; compare >= 0; compare--) {
            const compareTarget: Target = container?.querySelector(
              `#${itemOpt.id}${arr[compare].key}`
            );

            if (compareTarget) {
              compareTarget.classList.add(...itemOpt.class.compare);
              await delay(itemOpt.delay * 2);

              if (arr[compare].value > arr[curIndex].value) {
                [blankTarget.style.left, compareTarget.style.left] = [
                  compareTarget.style.left,
                  blankTarget.style.left,
                ];
                await delay(itemOpt.delay / 2);
                compareTarget.classList.remove(...itemOpt.class.compare);
                await delay(itemOpt.delay);

                [arr[compare], arr[curIndex]] = [arr[curIndex], arr[compare]];
                curIndex = compare;

                if (compare === 0) {
                  await lastChange(curTarget, blankTarget);
                  compareTarget.classList.remove(...itemOpt.class.compare);
                  await delay(itemOpt.delay);
                }
                continue;
              }

              await lastChange(curTarget, blankTarget);
              compareTarget.classList.remove(...itemOpt.class.compare);
              await delay(itemOpt.delay);
              break;
            }
          }
        }

        setProgress(((pointer + 1) / (lastIndex + 1)) * 100);
      }

      setIsComplte(true);
      setIsPending(false);
    },
    [itemOpt, lastChange]
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
        <div ref={containerRef} className="relative select-none w-full h-36">
          <SortItem
            id={`${itemOpt.id}blank`}
            style={{ width: itemOpt.width, top: 0, left: 0 }}
            className="border-0 shadow-none"
          />
          {list?.map((obj, idx) => {
            return (
              <SortItem
                id={`${itemOpt.id}${obj.key}`}
                key={`${itemOpt.id}${obj.key}`}
                style={{
                  width: itemOpt.width,
                  top: `calc(${itemOpt.width} + ${itemOpt.gap})`,
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
          onClick={() => sortInsertion([...list])}
        >
          정렬
        </Button>
      </div>
    </div>
  );
};

export default InsertionSort;
