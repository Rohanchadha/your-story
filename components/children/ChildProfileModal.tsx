"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import type { ChildProfile } from "@/lib/types/child";

type ChildProfileDraft = {
  name: string;
  nickname: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
};

const emptyDraft: ChildProfileDraft = {
  name: "",
  nickname: "",
  dateOfBirth: "",
  gender: "",
  city: "",
  country: "",
};

type ChildProfileModalProps = {
  child?: ChildProfile | null;
  onClose: () => void;
  onSave: (draft: ChildProfileDraft & { id?: string }) => void;
};

export function ChildProfileModal({ child, onClose, onSave }: ChildProfileModalProps) {
  const [draft, setDraft] = useState<ChildProfileDraft>(emptyDraft);

  useEffect(() => {
    if (!child) {
      setDraft(emptyDraft);
      return;
    }

    setDraft({
      name: child.name,
      nickname: child.nickname ?? "",
      dateOfBirth: child.dateOfBirth,
      gender: child.gender ?? "",
      city: child.city ?? "",
      country: child.country ?? "",
    });
  }, [child]);

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="child-profile-modal-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Profile setup</p>
            <h2 id="child-profile-modal-title">{child ? "Edit Child" : "Add Child"}</h2>
          </div>
          <button aria-label="Close" className="icon-button" onClick={onClose} type="button">
            x
          </button>
        </div>

        <div className="modal-grid">
          <label className="field">
            <span>Name</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              value={draft.name}
            />
          </label>
          <label className="field">
            <span>Nickname</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, nickname: event.target.value }))}
              value={draft.nickname}
            />
          </label>
          <label className="field">
            <span>Date of Birth</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, dateOfBirth: event.target.value }))}
              type="date"
              value={draft.dateOfBirth}
            />
          </label>
          <label className="field">
            <span>Gender</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value }))}
              value={draft.gender}
            />
          </label>
          <label className="field">
            <span>City</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}
              value={draft.city}
            />
          </label>
          <label className="field">
            <span>Country</span>
            <input
              onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
              value={draft.country}
            />
          </label>
        </div>

        <div className="modal-actions">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                ...draft,
                id: child?.id,
              })
            }
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
