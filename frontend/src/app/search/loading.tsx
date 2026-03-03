export function LoadingState() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 rounded bg-muted"></div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col rounded-2xl border border-border bg-card shadow-sm h-[320px]">
                        <div className="h-48 w-full rounded-t-2xl bg-muted/80"></div>
                        <div className="flex flex-1 flex-col p-4 space-y-4">
                            <div className="h-6 w-3/4 rounded bg-muted/80"></div>
                            <div className="h-5 w-1/2 rounded bg-muted/80"></div>
                            <div className="mt-auto flex justify-between">
                                <div className="h-4 w-1/3 rounded bg-muted/60"></div>
                                <div className="h-4 w-1/4 rounded bg-muted/60"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="container py-8 space-y-8 min-h-screen">
            <div className="flex h-14 w-full max-w-2xl rounded-full bg-muted animate-pulse"></div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="hidden md:block h-[500px] rounded-2xl bg-muted animate-pulse"></div>
                <div className="md:col-span-3 lg:col-span-4">
                    <LoadingState />
                </div>
            </div>
        </div>
    );
}
