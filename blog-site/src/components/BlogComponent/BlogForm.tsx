"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format, set } from "date-fns";
import { Blog, createBlog } from "@/redux/BlogSlice/BlogSlice";
import { useRouter } from "next/navigation";
import { User } from "@/redux/AuthSlice/SignUp";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

type Props = {};

const BlogForm = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);
  const dispatch = useDispatch<AppDispatch>();
  const handleAddTag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Blog = {
      title,
      description,
      date: date || new Date(),
      tags,
      userId: currentUser?.id || "",
    };
    dispatch(createBlog(data));
    setTitle("");
    setDescription("");
    setDate(new Date());
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-6 mx-24">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="title" className="font-semibold">
            Title
          </Label>
          <Input
            type="text"
            id="title"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full mt-4">
          <Label htmlFor="description" className="font-semibold">
            Description
          </Label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Write your description here..."
            theme="snow"
          />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <Label htmlFor="tags" className="font-semibold">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="tags" className="font-semibold">
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="tags"
              placeholder="Enter a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button
              onClick={handleAddTag}
              className="bg-[#fc5185] hover:bg-[#fc5185] hover:text-[#6943e7] font-semibold"
            >
              Add Tag
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border rounded px-2 py-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="mt-4 bg-[#fc5185] hover:bg-[#fc5185] hover:text-[#6943e7] font-semibold"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
