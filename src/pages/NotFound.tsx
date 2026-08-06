import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <p className="text-7xl font-extrabold tracking-tight text-primary">
                404
              </p>
              <p className="mt-3 text-lg font-semibold text-muted-foreground">
                Page not found
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground/80">
                That page has gone off the menu — but there&apos;s still a
                dinner to decide.
              </p>
              <Button asChild className="mt-6">
                <Link to="/cook">Find me a recipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
