import { toast } from "sonner";
import { report } from "@/mock/actions";
import type { ReportTarget } from "@/mock/types";
import { FormDialog, str } from "./FormDialog";

const REASONS = [
  "Spam or advertising",
  "Selling animals",
  "Harassment or hate",
  "Animal cruelty",
  "Misleading health advice",
  "Something else",
];

export function ReportDialog({
  target,
  onClose,
}: {
  target: { kind: ReportTarget; id: string; excerpt: string } | null;
  onClose: () => void;
}) {
  return (
    <FormDialog
      open={!!target}
      onOpenChange={(v) => !v && onClose()}
      title="Report this"
      description="Our team reviews every report. The person won't know who reported them."
      fields={[
        {
          key: "reason",
          label: "What's wrong?",
          type: "select",
          options: REASONS,
          required: true,
          full: true,
        },
        { key: "details", label: "Anything else we should know", type: "textarea" },
      ]}
      initial={{ reason: REASONS[0]!, details: "" }}
      submitLabel="Send report"
      onSubmit={async (v) => {
        if (!target) return;
        await report(target.kind, target.id, target.excerpt, str(v["reason"]), str(v["details"]));
        toast.success("Thanks — our team will take a look.");
      }}
    />
  );
}
