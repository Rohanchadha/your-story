"use client";

import { Button } from "@/components/shared/Button";
import type { ChildProfile } from "@/lib/types/child";
import { getAgeFromDateOfBirth } from "@/lib/utils/date";

type ChildProfileCardProps = {
  child: ChildProfile;
  onEdit: (child: ChildProfile) => void;
  onDelete: (childId: string) => void;
};

export function ChildProfileCard({ child, onEdit, onDelete }: ChildProfileCardProps) {
  const age = getAgeFromDateOfBirth(child.dateOfBirth);

  return (
    <article className="profile-card">
      <p className="eyebrow">Child profile</p>
      <h2>{child.name}</h2>
      <p className="muted-text">{child.nickname ? `Nickname: ${child.nickname}` : "Nickname can be added later."}</p>
      <ul className="profile-card__meta">
        <li>{age !== null ? `${age} years old` : "Age unavailable"}</li>
        <li>{child.dateOfBirth}</li>
        <li>{child.city || "City not added"}</li>
        <li>{child.country || "Country not added"}</li>
      </ul>
      <div className="profile-card__actions">
        <Button onClick={() => onEdit(child)} variant="secondary">
          Edit
        </Button>
        <Button onClick={() => onDelete(child.id)} variant="ghost">
          Delete
        </Button>
      </div>
    </article>
  );
}
