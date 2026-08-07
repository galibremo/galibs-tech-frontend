import { Cancel, Search } from "@hugeicons/core-free-icons"
import { Input } from "../ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../ui/button"


const GlobalSearch = () => {
    return (
        <div className="relative flex items-center">
            <Input autoFocus type="text" placeholder="Search" className="py-4.5 ring-0! px-4 pr-9 w-xl" />
            <Button variant="secondary" className="absolute right-1.5 cursor-pointer" size="icon-sm">
                <HugeiconsIcon icon={Search} />
            </Button>
        </div>

    )
}

export default GlobalSearch