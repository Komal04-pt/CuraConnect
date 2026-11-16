// Opt-in pagination: if the request has ?page=, return one page; otherwise return everything
// (so older frontends that don't send ?page= keep working).
export const getPagination = (req, defaultLimit = 10, maxLimit = 100) => {
  if (req.query.page === undefined) return null;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || defaultLimit, 1),
    maxLimit
  );
  return { page, limit, skip: (page - 1) * limit };
};

export const pageInfo = (pg, total) =>
  pg ? { page: pg.page, limit: pg.limit, totalPages: Math.ceil(total / pg.limit) || 1 } : {};
