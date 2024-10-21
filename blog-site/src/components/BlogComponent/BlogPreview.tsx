"use client";
import { getBlogById } from "@/redux/BlogSlice/BlogSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";

type Props = {
  id: string | string[];
};

const BlogPreview = ({ id }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getBlogById(id));
    }
  }, [dispatch, id]);

  const blog = useSelector((state: RootState) => state.blogs.blog);
  console.log(id);
  console.log(blog);
  return (
    <div className="mt-4">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{blog.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
          <div className="flex flex-wrap mt-3">
            {blog.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-[#fc5185] text-sm px-2 py-1 rounded-full mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter className="text-gray-500 text-sm">
          <span>{format(new Date(blog.date), "PPP")}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogPreview;
