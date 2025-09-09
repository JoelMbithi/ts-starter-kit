"use client"
import React, { useState } from 'react'
  import { Card, CardContent } from '../ui/card'
  import { Avatar, AvatarImage } from '../ui/avatar'
  import { Textarea } from '../ui/textarea'
  import { useUser } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { ImageIcon, Loader2Icon, SendIcon } from 'lucide-react'
import { createPost } from '@/actions/post.actions'
import toast from 'react-hot-toast'

  function CreatePost() {
   const { user } = useUser()
    const [content,setContent] = useState("")
    const [imageUrl,setImageUrl] = useState("")
    const [isPosting,setIsPosting]= useState(false)
    const[showImageUpload,setShowImageUpload]= useState(false)

    const handleSubmit = async () => {

  setIsPosting(true);
      try {
        const result = await createPost(content,imageUrl)
        if(result.success){
          setContent("")
          setImageUrl("")
          setShowImageUpload(false)

          toast.success("Post created successfully")
        }
      } catch (error) {
        console.error("Failed to create post",error)
        toast.error("Failed to create post.")
      }finally{

  setIsPosting(false);
      }
    }
    return (
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            <div className='flex border p-2 rounded-md mb-2 space-x-4'>
            <Avatar className='w-10 h-10'>
              <AvatarImage src={user?.imageUrl || "npm dlx shadcn@latest add avatar"}/>
            </Avatar>
            <Textarea
            placeholder="What's on your mind?"
            value={content}
            className='min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base'
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
            />
            </div>
          </div>

          <div className='flex items-center justify-between border-t pt-4'>
            <div className='flex space-x-2 mt-2'>
              <Button className="text-muted-foreground hover:text-foreground"
                type='button'
                variant={"ghost"}
                size={"sm"}
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                 <ImageIcon className='size-4 mr-2'/>
                 Photo
              </Button>
            </div>
            <Button className='flex items-center ring-1 ' variant={"ghost"} onClick={handleSubmit} disabled={(!content.trim() && !imageUrl) || isPosting}>
              {isPosting ? (
                <>
                <Loader2Icon className="size-4 mr-2 animate-spin"/>
                Posting...
                </>
              ): (
                <>
                <SendIcon className='size-4  mr-4'/>
                Post
                </>
              )}

            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  export default CreatePost