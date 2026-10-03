"use client";

import React, { useEffect, useState } from "react";
import { PostData } from "../PostRow";
import { placeholderUrl } from "@/lib/defaultData";
import { ImageUploadField } from "../ImageUploadField";
import { DotsLoader } from "../DotsLoader";
import { useActivityLog } from "@/context/ActivityLogContext";
import { SuccessLightbox } from "./SuccessLightbox";
import { ConfirmLightbox } from "./ConfirmLightbox";
import { formatDate } from "@/utils/formatDate";

interface PostsManagerProps {
  posts: PostData[];
  onRefresh: () => void;
}

export const PostsManager: React.FC<PostsManagerProps> = ({
  posts,
  onRefresh,
}) => {
  const { addLog } = useActivityLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [headline, setHeadline] = useState("");
  const [sub, setSub] = useState("");
  const [thumbUrl, setThumbUrl] = useState(
    placeholderUrl("Post thumbnail", 640, 360),
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTopOnTheList, setIsTopOnTheList] = useState(false);
  const [content, setContent] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setDate("");
    setHeadline("");
    setSub("");
    setThumbUrl(placeholderUrl("Post thumbnail", 640, 360));
    setIsFeatured(false);
    setIsTopOnTheList(false);
    setContent("");
    setAuthorAvatar("");
    setStatus("");
  };

  const handleEdit = (post: PostData) => {
    setEditingId(post.id || (post as any)._id || null);
    let setPostDate = post.date || new Date().toISOString();
    if (setPostDate.includes("T")) {
      setPostDate = setPostDate.split("T")[0];
    }
    setDate(setPostDate);
    setHeadline(post.headline);
    setSub(post.sub);
    setThumbUrl(post.thumbUrl || "");
    setIsFeatured(!!post.isFeatured);
    setIsTopOnTheList(!!post.isTopOnTheList);
    setContent(post.content || "");
    setAuthorAvatar(post.authorAvatar || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFeature = async (post: PostData) => {
    const postId = post.id || (post as any)._id;
    if (!postId) return;
    setStatus("Updating feature status...");
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isFeatured: !post.isFeatured }),
      });
      if (res.ok) {
        setStatus(`Story ${!post.isFeatured ? "featured" : "unfeatured"}!`);
        addLog(
          `${!post.isFeatured ? "Featured" : "Unfeatured"} story: "${post.headline}"`,
          "update",
        );
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus("Error updating story feature status.");
    }
  };

  const handleToggleTopOnTheList = async (post: PostData) => {
    const postId = post.id || (post as any)._id;
    if (!postId) return;
    setStatus("Updating Top on the List status...");
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isTopOnTheList: !post.isTopOnTheList }),
      });
      if (res.ok) {
        setStatus(`Story ${!post.isTopOnTheList ? "added to Top List" : "removed from Top List"}!`);
        addLog(
          `${!post.isTopOnTheList ? "Added to" : "Removed from"} Top List: "${post.headline}"`,
          "update"
        );
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus("Error updating story Top on the List status.");
    }
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };

  const performDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);
    setStatus("Deleting...");
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatus("Story deleted successfully!");
        addLog("Deleted a story", "delete");
        onRefresh();
      }
    } catch (e) {
      console.error(e);
      setStatus("Error deleting story.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("Saving...");

    const payload = {
      date,
      headline,
      sub,
      content,
      thumbUrl,
      authorAvatar,
      isFeatured,
      isTopOnTheList,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/posts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus("Story updated successfully!");
          addLog(`Updated story: "${headline}"`, "update");
          resetForm();
          onRefresh();
        }
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus("Story created successfully!");
          addLog(`Created new story: "${headline}"`, "create");
          resetForm();
          onRefresh();
        }
      }
    } catch (e) {
      console.error(e);
      setStatus("Error saving story.");
    } finally {
      setIsSaving(false);
    }
  };

  const ITEMS_PER_PAGE = 5;
  const [currentTablePage, setCurrentTablePage] = useState(1);
  
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const totalTablePages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="section-label m-0">Manage Stories & Posts</div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            const el = document.getElementById("story-form-card");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="admin-btn-primary text-xs py-2 px-3.5"
          data-testid="add-new-story-btn"
        >
          + Add New Story
        </button>
      </div>

      <div className="admin-card" id="story-form-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold">
            {editingId ? "Edit Story" : "Add New Story"}
          </h4>
          {editingId && (
            <span className="text-xs bg-[var(--orange)]/20 text-[var(--orange)] px-2.5 py-1 rounded font-bold border border-[var(--orange)]/30">
              Editing Existing Post
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} id="story-form">
          <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 mb-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Date
              </label>
              <input
                type="date"
                className="admin-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="JAN 21"
                required
                data-testid="post-date-input"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Headline
              </label>
              <input
                className="admin-input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. 2 months + dev shared a note..."
                required
                data-testid="post-headline-input"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-[var(--muted)] uppercase">
              Story Content (Write up)
            </label>
            <textarea
              className="admin-input h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full story content..."
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] uppercase">
                Subtitle / Author Details
              </label>
              <input
                className="admin-input"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. Faith Borntowin | 2 months + | Developer"
                required
                data-testid="post-sub-input"
              />
            </div>
            <ImageUploadField
              label="Author Avatar (Optional)"
              value={authorAvatar}
              onChange={setAuthorAvatar}
              testId="post-author-avatar-input"
              aspectRatioHint="Recommended: 1:1 circle/square avatar"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[var(--border)] p-4 rounded-lg bg-[var(--bg)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={
                  !isFeatured && posts.filter((p) => p.isFeatured).length >= 1
                }
                className="w-4 h-4 cursor-pointer accent-[var(--green)]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold">Featured Story</span>
                <span className="text-[11px] text-[var(--muted)]">
                  Shows on Homepage (Max 1)
                </span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTopOnTheList}
                onChange={(e) => setIsTopOnTheList(e.target.checked)}
                disabled={
                  !isTopOnTheList &&
                  posts.filter((p) => p.isTopOnTheList).length >= 4
                }
                className="w-4 h-4 cursor-pointer accent-[var(--green)]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold">Top on the List</span>
                <span className="text-[11px] text-[var(--muted)]">
                  Shows in Top Items section (Max 4)
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 mb-5">
            <div>
              <div className="text-[11px] text-[var(--muted)] mb-2">
                Note: Please upload an image to represent this story or feature
                card.
              </div>
              <ImageUploadField
                label="Thumbnail / Cover (640x360)"
                value={thumbUrl}
                onChange={setThumbUrl}
                fallbackPlaceholder={placeholderUrl("Post thumbnail", 640, 360)}
                testId="post-thumb-input"
                aspectRatioHint="Recommended: 16:9 widescreen thumbnail"
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={isSaving}
              data-testid="post-submit-btn"
            >
              {isSaving ? (
                <DotsLoader />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Create Story"
              )}
            </button>
            {editingId && (
              <button
                type="button"
                className="admin-tab-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h4 className="text-base font-bold flex items-center gap-3">
            Stories Feed ({posts.length})
          </h4>

          <div className="flex items-center gap-3">
            {posts.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTablePage((p) => Math.max(1, p - 1))}
                  disabled={currentTablePage === 1}
                  className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  &larr;
                </button>
                <span className="text-xs text-[var(--muted)] font-bold">
                  Page {currentTablePage} of {totalTablePages}
                </span>
                <button
                  onClick={() =>
                    setCurrentTablePage((p) => Math.min(totalTablePages, p + 1))
                  }
                  disabled={currentTablePage === totalTablePages}
                  className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  &rarr;
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                resetForm();
                const el = document.getElementById("story-form-card");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="admin-btn-primary text-xs py-1.5 px-3"
            >
              + Create New Story
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="admin-table min-w-[620px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>Headline</th>
                <th className="hidden group-[.sidebar-collapsed]:table-cell">Author / Subtitle</th>
                <th>Thumbnail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post, idx) => {
                const postId = post.id || (post as any)._id;
                return (
                  <tr key={postId || idx}>
                    <td className="text-[var(--orange)] font-bold">
                      {formatDate(post.date)}
                    </td>
                    <td className="font-semibold max-w-[300px]">
                      {post.headline}
                    </td>
                    <td className="hidden group-[.sidebar-collapsed]:table-cell text-[var(--muted)]">{post.sub}</td>
                    <td>
                      {post.thumbUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={post.thumbUrl}
                          alt={post.headline}
                          className="w-[50px] h-[30px] object-cover rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(post)}
                          disabled={
                            !post.isFeatured &&
                            posts.filter((p) => p.isFeatured).length >= 1
                          }
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md font-bold transition ${
                            post.isFeatured
                              ? "bg-[var(--green)]/20 text-[var(--green)] hover:bg-[var(--green)]/30"
                              : "bg-white/5 text-[var(--muted)] hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={post.isFeatured ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          {post.isFeatured ? "Featured" : "Feature"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTopOnTheList(post)}
                          disabled={
                            !post.isTopOnTheList &&
                            posts.filter((p) => p.isTopOnTheList).length >= 4
                          }
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md font-bold transition ${
                            post.isTopOnTheList
                              ? "bg-[var(--green)]/20 text-[var(--green)] hover:bg-[var(--green)]/30"
                              : "bg-white/5 text-[var(--muted)] hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={post.isTopOnTheList ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Top List
                        </button>
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(post)}
                          data-testid={`edit-post-btn-${idx}`}
                          disabled={deletingId === postId}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn-danger"
                          onClick={() => handleDelete(postId)}
                          data-testid={`delete-post-btn-${idx}`}
                          disabled={deletingId === postId}
                        >
                          {deletingId === postId ? "Del..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmLightbox
        isOpen={!!confirmDeleteId}
        title="Delete Story?"
        message="Are you sure you want to permanently delete this story? This action cannot be undone."
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <SuccessLightbox
        message={status}
        onClose={() => setStatus("")}
      />
    </div>
  );
};
