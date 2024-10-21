"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getAllBlogs } from "@/redux/BlogSlice/BlogSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";

type Props = {};

const BlogList = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCreateBlog = () => {
    router.push("/blog/create");
  };

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const tags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));
  const handlePreview = (blogId: string | undefined) => {
    router.push(`/blog/preview/${blogId}`);
  };

  const isExactMatch = (title: string, query: string) => {
    return title.toLowerCase().startsWith(query.toLowerCase());
  };
  const filteredBlogs = blogs.filter((blog) => {
    const matchesQuery = isExactMatch(blog.title, searchQuery);
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => blog.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="bg-[#f4f5ff] h-screen overflow-y-auto p-6">
      <div className="mt-6 flex flex-col">
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md"
          />
          <Button
            className="bg-[#fc5185] hover:bg-[#fc5185] hover:text-[#6943e7] font-semibold"
            onClick={handleCreateBlog}
          >
            Write Blog
          </Button>
        </div>


        <div className="mt-4">
          <h3 className="font-semibold">Select Tags:</h3>
          <div className="flex flex-wrap mt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`mr-2 mb-2 p-2 rounded-md ${
                  selectedTags.includes(tag)
                    ? "bg-[#fc5185] text-white"
                    : "bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {blog.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                Created on: {format(new Date(blog.date), "MMMM dd, yyyy")}
              </div>
              <div>Tags: {blog.tags.join(", ")}</div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#fc5185] hover:bg-[#fc5185] hover:text-[#6943e7] font-semibold"
                  onClick={() => handlePreview(blog.id)}
                >
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
