"use client";

import { useEffect, useState } from "react";
import { ChildProfileCard } from "@/components/children/ChildProfileCard";
import { ChildProfileModal } from "@/components/children/ChildProfileModal";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/shared/Button";
import { deleteChild, getChildren, saveChild } from "@/lib/storage/children";
import type { ChildProfile } from "@/lib/types/child";

type ChildProfileDraft = {
  id?: string;
  name: string;
  nickname: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
};

export default function ChildrenPage() {
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setChildrenProfiles(getChildren());
  }, []);

  function openCreateModal() {
    setEditingChild(null);
    setIsModalOpen(true);
  }

  function handleSave(draft: ChildProfileDraft) {
    if (!draft.name.trim() || !draft.dateOfBirth) {
      return;
    }

    saveChild({
      id: draft.id,
      name: draft.name.trim(),
      nickname: draft.nickname.trim() || undefined,
      dateOfBirth: draft.dateOfBirth,
      gender: draft.gender.trim() || undefined,
      city: draft.city.trim() || undefined,
      country: draft.country.trim() || undefined,
    });

    setChildrenProfiles(getChildren());
    setIsModalOpen(false);
    setEditingChild(null);
  }

  function handleDelete(childId: string) {
    deleteChild(childId);
    setChildrenProfiles(getChildren());
  }

  return (
    <PageShell>
      <section className="page-title">
        <div>
          <p className="eyebrow">My children</p>
          <h1>Create profiles whenever you want a story to feel a little more personal.</h1>
          <p>Profiles stay optional, but they help us tailor prompts, vocabulary, and emotional tone later on.</p>
        </div>
        <Button onClick={openCreateModal}>Add Child</Button>
      </section>

      {childrenProfiles.length > 0 ? (
        <section className="profile-grid">
          {childrenProfiles.map((child) => (
            <ChildProfileCard
              child={child}
              key={child.id}
              onDelete={handleDelete}
              onEdit={(nextChild) => {
                setEditingChild(nextChild);
                setIsModalOpen(true);
              }}
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <p className="eyebrow">No profiles yet</p>
          <h2>Add your first child profile when you're ready.</h2>
          <p className="muted-text">You can still create stories without this step, then come back later for personalization.</p>
          <div className="hero-section__actions">
            <Button onClick={openCreateModal}>Add Child</Button>
            <Button href="/create" variant="secondary">
              Skip to Story Creation
            </Button>
          </div>
        </section>
      )}

      {isModalOpen ? (
        <ChildProfileModal child={editingChild} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      ) : null}
    </PageShell>
  );
}
