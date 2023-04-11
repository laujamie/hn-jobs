import { useState } from "react";
import type { ReactNode } from "react";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { Virtuoso } from "react-virtuoso";
import { sanitize } from "isomorphic-dompurify";
import type { ItemV0 } from "@lib/hn";

export interface JobContainerProps {
  items: ItemV0[] | null;
}

export default function JobContainer({ items }: JobContainerProps): ReactNode {
  const [displayItems, setDisplayItems] = useState<ItemV0[] | null>(items);
  const [isNewest, setIsNewest] = useState(1);

  const searchItem = (query: string) => {
    if (!query) {
      setDisplayItems(items);
      return;
    } else if (items == null) {
      return;
    }
    const fuse = new Fuse(items, {
      keys: ["text"],
    });
    const result = fuse.search(query);
    if (result.length > 0) {
      const tmp = result.map(({ item }) => item);
      setDisplayItems(tmp);
    } else {
      setDisplayItems([]);
    }
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex space-x-2">
        <input
          type="search"
          onChange={(e) => searchItem(e.target.value)}
          placeholder="Search for job postings"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="relative w-full lg:max-w-sm">
          <select
            className="w-full py-2 px-3 text-gray-700 bg-white border rounded shadow-sm outline-none appearance-none focus:border-indigo-600"
            value={isNewest}
            onChange={(e) => {
              e.preventDefault();
              setIsNewest(Number(e.target.value));
            }}
          >
            <option value={1}>Date, newest to oldest</option>
            <option value={-1}>Date, oldest to newest</option>
          </select>
        </div>
      </div>
      {displayItems != null && (
        <Virtuoso
          className="h-full"
          data={[...displayItems].sort((a, b) =>
            a.time >= b.time ? -1 * isNewest : 0
          )}
          useWindowScroll
          itemContent={(_, item) =>
            item.text && (
              <div
                className="block p-6 rounded-lg border-gray-200 border break-words mt-2 overflow-auto"
                key={item.id}
              >
                <h2 className="text-gray-800 text-3xl font-semibold">
                  {dayjs.unix(item.time).format("MMM D, YYYY, h:mm a")}
                </h2>
                <div
                  className="mt-2 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: sanitize(item.text ?? ""),
                  }}
                />
              </div>
            )
          }
        />
      )}
    </div>
  );
}
