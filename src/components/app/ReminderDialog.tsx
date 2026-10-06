import { toast } from "sonner";
import { saveReminder } from "@/mock/actions";
import { REMINDER_KINDS, type Pet, type Reminder } from "@/mock/types";
import { FormDialog, str } from "./FormDialog";

const REPEATS = [
  { value: "none", label: "Doesn't repeat" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
  { value: "yearly", label: "Every year" },
] as const;

export function ReminderDialog({
  open,
  onOpenChange,
  pets,
  defaultPetId,
  reminder,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pets: Pet[];
  defaultPetId?: string;
  reminder?: Reminder;
}) {
  const inAWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={reminder ? "Edit reminder" : "Set a reminder"}
      description="We'll notify you in the app (and by email, if it's switched on) a week before and on the day."
      fields={[
        {
          key: "petId",
          label: "Pet",
          type: "select",
          options: pets.map((p) => ({ value: p.id, label: p.name })),
          required: true,
        },
        { key: "kind", label: "Type", type: "select", options: REMINDER_KINDS, required: true },
        {
          key: "title",
          label: "What's due",
          required: true,
          placeholder: "Rabies booster",
          full: true,
        },
        { key: "dueOn", label: "Date", type: "date", required: true },
        { key: "time", label: "Time", type: "time" },
        { key: "repeat", label: "Repeat", type: "select", options: REPEATS, full: true },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      initial={{
        petId: reminder?.petId ?? defaultPetId ?? pets[0]?.id ?? "",
        kind: reminder?.kind ?? "Vaccination",
        title: reminder?.title ?? "",
        dueOn: reminder?.dueOn ?? inAWeek,
        time: reminder?.time ?? "10:00",
        repeat: reminder?.repeat ?? "none",
        notes: reminder?.notes ?? "",
      }}
      submitLabel={reminder ? "Save reminder" : "Set reminder"}
      onSubmit={async (v) => {
        await saveReminder({
          ...(reminder ? { id: reminder.id } : {}),
          petId: str(v["petId"]),
          kind: str(v["kind"]) as Reminder["kind"],
          title: str(v["title"]),
          dueOn: str(v["dueOn"]),
          time: str(v["time"]),
          repeat: str(v["repeat"]) as Reminder["repeat"],
          notes: str(v["notes"]),
        });
        toast.success(reminder ? "Reminder updated" : "Reminder set");
      }}
    />
  );
}
