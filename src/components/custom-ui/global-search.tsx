import { Search } from "@hugeicons/core-free-icons"
import { Input } from "../ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface GlobalSearchProps {
    className?: string;
    autoFocus?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className, autoFocus }) => {
    return (
        <div className={cn("relative items-center justify-center w-full", className)}>
            <Input type="text" placeholder="Search" className={cn("h-10 ring-0! px-4 pr-9 w-full rounded-none lg:rounded-lg focus-visible:border-input lg:focus-visible:border-ring")} autoFocus={autoFocus} />
            <Button variant="secondary" className="absolute right-1.5 cursor-pointer" size="icon-sm">
                <HugeiconsIcon icon={Search} />
            </Button>
        </div>
    )
}

export default GlobalSearch