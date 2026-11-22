const PRIORITY_RANK = { low: 1, medium: 2, high: 3 };

function compareValues(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "tr");
}

function sortItems(items, sort) {
  if (!sort) return items;
  const descending = sort.startsWith("-");
  const field = descending ? sort.slice(1) : sort;
  const valueOf = (item) => (field === "priority" ? PRIORITY_RANK[item.priority] : item[field]);

  return [...items].sort((a, b) => {
    const result = compareValues(valueOf(a), valueOf(b));
    return descending ? -result : result;
  });
}

function paginate(items, query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit)
    }
  };
}

module.exports = { sortItems, paginate };
