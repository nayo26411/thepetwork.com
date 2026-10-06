import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fieldClass, useBusy } from "./ui";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "date" | "time" | "number" | "textarea" | "select" | "switch";
  options?: readonly string[] | readonly { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  full?: boolean;
};

export type Values = Record<string, string | boolean>;

/** A small dialog form driven by a list of fields — used for the many record editors. */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  submitLabel = "Save",
  onSubmit,
  extra,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  fields: Field[];
  initial: Values;
  submitLabel?: string;
  onSubmit: (values: Values) => Promise<void>;
  extra?: ReactNode;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [busy, run] = useBusy();

  useEffect(() => {
    if (open) setValues(initial);
    // Reset only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await onSubmit(values);
              onOpenChange(false);
            });
          }}
        >
          {fields.map((f) => {
            const id = `fd-${f.key}`;
            const value = values[f.key];
            const full = f.full || f.type === "textarea";
            return (
              <div key={f.key} className={full ? "sm:col-span-2" : ""}>
                {f.type === "switch" ? (
                  <label
                    htmlFor={id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-oat p-3 text-sm font-semibold"
                  >
                    {f.label}
                    <Switch
                      id={id}
                      checked={value === true}
                      onCheckedChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
                    />
                  </label>
                ) : (
                  <>
                    <Label htmlFor={id}>
                      {f.label}{" "}
                      {!f.required && (
                        <span className="font-normal text-muted-foreground">(optional)</span>
                      )}
                    </Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        id={id}
                        rows={3}
                        maxLength={600}
                        value={String(value ?? "")}
                        placeholder={f.placeholder}
                        onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                        className="mt-1.5 rounded-xl"
                        required={f.required}
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={id}
                        value={String(value ?? "")}
                        onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                        className={fieldClass}
                        required={f.required}
                      >
                        {f.options?.map((o) =>
                          typeof o === "string" ? (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ) : (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <Input
                        id={id}
                        type={f.type ?? "text"}
                        value={String(value ?? "")}
                        placeholder={f.placeholder}
                        maxLength={f.type === "text" || !f.type ? 120 : undefined}
                        onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                        className="mt-1.5 rounded-xl"
                        required={f.required}
                      />
                    )}
                    {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
                  </>
                )}
              </div>
            );
          })}
          {extra && <div className="sm:col-span-2">{extra}</div>}
          <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              {busy ? "Saving…" : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const str = (v: string | boolean | undefined) => (typeof v === "string" ? v.trim() : "");
