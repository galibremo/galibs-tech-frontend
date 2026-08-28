import { route } from "@/routes/routes";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={route.public.home}>
      <span className="font-medium text-2xl tracking-[0.4rem] md:tracking-[0.5rem]">
        GALIB's
      </span>
    </Link>
  );
};

export default Logo;
