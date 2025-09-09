
import { getPost } from "@/actions/post.actions";
import CreatePost from "@/components/MainContainer/CreatePost";
import { ModeToggle } from "@/components/ModeToggle";
import PostCard from "@/components/Post/PostCard";
import WhoToFollow from "@/components/SideBar/WhoToFollow";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser()
  const posts = await getPost()

  return (
   <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
       <div className="lg:col-span-6">
        {user ? <CreatePost/> : null}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post}/>
          ))}
        </div>
       </div>
       <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow/>
       </div>
   </div>
  );
}
