"use client"
import BlogPreview from '@/components/BlogComponent/BlogPreview'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  const {blogId} = useParams();
  return (
    <BlogPreview id={blogId}/>
  )
}

export default page