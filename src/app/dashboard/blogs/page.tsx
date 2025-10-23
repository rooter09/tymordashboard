'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  categories?: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogsPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBlogId) return;

    try {
      const response = await fetch(`/api/blogs/${deleteBlogId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Blog deleted successfully',
        });
        setDeleteBlogId(null);
        fetchBlogs();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete blog',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog content</p>
        </div>
        <Link href="/dashboard/blogs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Blog Post
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No blog posts found</p>
            <Link href="/dashboard/blogs/new">
              <Button>Create Your First Blog Post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <Card key={blog._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-xl">{blog.title}</CardTitle>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : blog.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {blog.status === 'published' && <Eye className="w-3 h-3 inline mr-1" />}
                        {blog.status === 'draft' && <EyeOff className="w-3 h-3 inline mr-1" />}
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        {blog.views} views
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">/{blog.slug}</p>
                    {blog.excerpt && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>
                    )}
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {blog.categories.map((category, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/blogs/${blog._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteBlogId(blog._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <span>By {blog.author}</span>
                  <span>•</span>
                  <span>Created by {blog.createdBy.name}</span>
                  <span>•</span>
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>•</span>
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteBlogId} onOpenChange={() => setDeleteBlogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

