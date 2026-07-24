import math


def paginate_params(page: int, page_size: int) -> tuple[int, int]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size
    return offset, page_size


def total_pages(total: int, page_size: int) -> int:
    return math.ceil(total / page_size) if total else 0
