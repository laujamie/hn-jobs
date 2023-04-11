import { ReactNode, useState } from "react";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import type { ItemV0 } from "@lib/hn";

export interface JobContainerProps {
  items: ItemV0[] | null;
}

export default function JobContainer({ items }: JobContainerProps): ReactNode {
  const [displayItems, setDisplayItems] = useState<ItemV0[] | null>(items);
  const searchItem = (query: string) => {
    if (!query) {
      setDisplayItems(items);
      return;
    } else if (items == null) {
      return;
    }
    const fuse = new Fuse(items, {
      keys: ["text"],
      includeScore: true,
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
    <div className="overflow-hidden space-y-4">
      <input
        type="search"
        onChange={(e) => searchItem(e.target.value)}
        placeholder="Search for job postings"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {displayItems != null &&
        displayItems
          .sort((a, b) => (a.time > b.time ? -1 : 0))
          .map((item) =>
            item.text != null ? (
              <div
                className="block p-6 rounded-lg border-gray-200 border"
                key={item.id}
              >
                <h2 className="text-gray-800 text-3xl font-semibold">
                  {dayjs.unix(item.time).format("MMM D, YYYY, h:mm a")}
                </h2>
                <div
                  className="mt-2 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: item.text,
                  }}
                />
              </div>
            ) : null
          )}
    </div>
  );
}
