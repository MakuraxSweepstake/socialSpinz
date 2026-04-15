/**
 * Appends a query param to a URLSearchParams instance.
 *
 * - If `key` is provided: appends `key=value`   (e.g. key="page", value=2  → "page=2")
 * - If `key` is omitted:  uses `value` as both key and value  (e.g. value="status" → "status=status")
 *
 * Returns the same URLSearchParams so calls can be chained if needed.
 */
export function buildQueryParams(
    params: URLSearchParams,
    value: string | number | boolean,
    key?: string
): URLSearchParams {
    const resolvedKey = key ?? String(value);
    params.append(resolvedKey, String(value));
    return params;
}

/**
 * Convenience wrapper: builds a query string from a plain object.
 * Skips entries whose value is undefined / null / empty-string.
 *
 * Usage:
 *   buildQueryString({ search, page: pageIndex, page_size: pageSize, status })
 *   // → "search=foo&page=1&page_size=10&status=active"
 */
export function buildQueryString(
    entries: Record<string, string | number | boolean | undefined | null>
): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(entries)) {
        if (value !== undefined && value !== null && value !== "") {
            buildQueryParams(params, value, key);
        }
    }
    return params.toString();
}
