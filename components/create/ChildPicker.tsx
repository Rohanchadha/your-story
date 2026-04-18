"use client";

import type { ChildProfile } from "@/lib/types/child";
import { getAgeFromDateOfBirth } from "@/lib/utils/date";

type ChildPickerProps = {
  childrenProfiles: ChildProfile[];
  value: string;
  onChange: (value: string) => void;
};

export function ChildPicker({ childrenProfiles, value, onChange }: ChildPickerProps) {
  return (
    <div className="stack-sm">
      <div>
        <p className="eyebrow">Step 2</p>
        <h2>Choose a child if you want personalization</h2>
      </div>

      <div className="chip-row">
        <button
          className={["chip-button", value === "" ? "chip-button--selected" : ""].filter(Boolean).join(" ")}
          onClick={() => onChange("")}
          type="button"
        >
          No child selected
        </button>
        {childrenProfiles.map((child) => {
          const age = getAgeFromDateOfBirth(child.dateOfBirth);
          return (
            <button
              key={child.id}
              className={["chip-button", value === child.id ? "chip-button--selected" : ""].filter(Boolean).join(" ")}
              onClick={() => onChange(child.id)}
              type="button"
            >
              {child.name}
              {age !== null ? `, ${age}` : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
