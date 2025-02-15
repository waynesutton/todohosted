import * as React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { MainApp } from "../App";

export const DynamicPage: React.FC = () => {
  const { slug } = useParams();
  const page = useQuery(api.pages.getPageBySlug, { slug: slug ?? "" });

  // Show loading state while we wait for the page data
  if (page === undefined)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Show 404 if page doesn't exist
  if (page === null)
    return <div className="min-h-screen flex items-center justify-center">Page not found</div>;

  // Show inactive message if page exists but is disabled
  if (!page.isActive)
    return (
      <div className="min-h-screen flex items-center justify-center">
        This page is currently inactive.
      </div>
    );

  return <MainApp pageId={page._id} />;
};
