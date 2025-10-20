import React from "react";

/* ---- TOC ---- */
const TocList = ({ toc, currentHref, goTo }) => {
  return (
    <ul className="space-y-1 pr-2">
      {toc.map((item) => (
        <TocRow
          key={item.id}
          item={item}
          depth={0}
          currentHref={currentHref}
          goTo={goTo}
        />
      ))}
    </ul>
  );
}

const TocRow = ({ item, depth, currentHref, goTo }) => {
  const isActive = (item.href || "").split("#")[0] === currentHref;
  return (
    <li>
      <button
        onClick={() => goTo(item)}
        className={`w-full text-left py-2 rounded px-2 ${
          isActive
            ? "text-emerald-400"
            : "text-gray-200 hover:text-white hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        title={item.label}
      >
        {item.label}
      </button>
      {item.subitems?.length > 0 &&
        item.subitems.map((sub) => (
          <TocRow
            key={sub.id}
            item={sub}
            depth={depth + 1}
            currentHref={currentHref}
            goTo={goTo}
          />
        ))}
    </li>
  );
}

export default TocList;