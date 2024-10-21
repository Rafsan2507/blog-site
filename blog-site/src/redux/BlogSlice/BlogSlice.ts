import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
export interface Blog{
    id?: string
    title: string;
    userId: string;
    description: string;
    date: Date;
    tags: string[];
}

export interface BlogState{
    blogs: Blog[];
    blog: Blog;
}

const initialState: BlogState= {
    blogs:[],
    blog: {
        id: "",
        title: "",
        userId: "",
        description: "",
        date: new Date(),
        tags: [],
    }
}
const Base_URL = "http://localhost:5000";
export const BlogSlice = createSlice({
    name: "travel",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
            state.blogs.push(action.payload);
        })
        builder.addCase(getAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
            state.blogs = action.payload;
        })
        builder.addCase(getBlogById.fulfilled, (state, action: PayloadAction<Blog>) => {
            state.blog = action.payload;
        })
    },
})

export const createBlog = createAsyncThunk(
    "blog/create",
    async (blog: Blog) => {
        const response = await axios.post(`${Base_URL}/blogs`, blog);
        return response.data;
    }
)

export const getAllBlogs = createAsyncThunk(
    "blog/get",
    async () => {
        const response = await axios.get(`${Base_URL}/blogs`);
        return response.data;
    }
)

export const getBlogById = createAsyncThunk(
    "blog/getBlogById",
    async(id: string) => {
        const response = await axios.get(`${Base_URL}/blogs/${id}`);
        return response.data;
    }
)

export default BlogSlice.reducer;