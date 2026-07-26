"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { type Post, type PostStatus, seedPosts } from "@/lib/instagram-data";

type InstagramPostsContextValue = {
  posts: Post[];
  addPost: (post: Post) => void;
  changeStatus: (id: string, status: PostStatus) => void;
  removePost: (id: string) => void;
};

const InstagramPostsContext = createContext<InstagramPostsContextValue | null>(null);

/**
 * Wraps the whole (dashboard) route group so Instagram Manager's post
 * data is a single source of truth other sections can read from —
 * specifically Content Dashboard's pillar breakdown. Session-only state
 * (useState), same persistence gap as everything else, but it means
 * Content Dashboard isn't showing a second, disconnected fake copy of
 * "how much content exists per pillar."
 */
export function InstagramPostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);

  function addPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }
  function changeStatus(id: string, status: PostStatus) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }
  function removePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <InstagramPostsContext.Provider value={{ posts, addPost, changeStatus, removePost }}>
      {children}
    </InstagramPostsContext.Provider>
  );
}

export function useInstagramPosts(): InstagramPostsContextValue {
  const ctx = useContext(InstagramPostsContext);
  if (!ctx) {
    throw new Error("useInstagramPosts must be used within InstagramPostsProvider");
  }
  return ctx;
}
