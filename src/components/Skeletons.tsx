export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-8 w-32 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-3 w-40 rounded-md bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-48 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-800"></div>
      </div>
      <div className="flex h-64 items-end gap-2 pt-4">
        <div className="h-1/4 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
        <div className="h-3/4 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
        <div className="h-2/4 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
        <div className="h-5/6 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
        <div className="h-1/3 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
        <div className="h-4/5 w-full rounded-t bg-gray-100 dark:bg-gray-800"></div>
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="animate-pulse flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-3 w-20 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-md bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-72 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
