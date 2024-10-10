import { AnimatePresence, motion } from "framer-motion";

export function NoRequests() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "12rem" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="p-4 grid place-items-center rounded-xl border border-dashed text-muted-foreground font-bold text-sm overflow-hidden"
      >
        No requests have been recieved.
      </motion.div>
    </AnimatePresence>
  );
}
