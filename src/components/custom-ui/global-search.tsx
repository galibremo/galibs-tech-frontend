import { Search } from "@hugeicons/core-free-icons"
import { Input } from "../ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../ui/button"


const GlobalSearch = () => {
    return (
        <div className="relative hidden lg:flex items-center justify-center w-full max-w-xl">
            <Input type="text" placeholder="Search" className="h-10 ring-0! px-4 pr-9 w-full" />
            <Button variant="secondary" className="absolute right-1.5 cursor-pointer" size="icon-sm">
                <HugeiconsIcon icon={Search} />
            </Button>
        </div>
    )
}

export default GlobalSearch