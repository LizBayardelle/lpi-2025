import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.adminData?.projects) {
      setProjects(window.adminData.projects);
      setLoading(false);
    }
  }, []);

  const handleSave = async (projectData) => {
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        if (projectData[key] !== null && projectData[key] !== undefined) {
          formData.append(`project[${key}]`, projectData[key]);
        }
      });

      const url = editingProject 
        ? `/admin/projects/${editingProject.id}`
        : '/admin/projects';
      
      const method = editingProject ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: formData
      });

      if (response.ok) {
        const savedProject = await response.json();
        
        if (editingProject) {
          setProjects(projects.map(p => 
            p.id === editingProject.id ? savedProject : p
          ));
        } else {
          setProjects([...projects, savedProject]);
        }
        
        setEditingProject(null);
        setShowForm(false);
      } else {
        alert('Error saving project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleDelete = async (project) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/admin/projects/${project.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        }
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== project.id));
      } else {
        alert('Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-medium text-slate-900">
          Manage Projects
        </h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      <div className="space-y-4">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={(project) => {
              setEditingProject(project);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-display text-xl font-medium text-slate-900 mb-2">
            {project.name}
          </h3>
          <p className="text-slate-600 mb-2 italic">"{project.short_description}"</p>
          <p className="text-sm text-slate-500 mb-4">
            {project.long_description?.substring(0, 150)}...
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener"
              className="text-blue-600 hover:text-blue-800"
            >
              View Site →
            </a>
            <span className={`px-2 py-1 rounded text-xs ${
              project.published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(project)}
            className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project)}
            className="text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    short_description: project?.short_description || '',
    what_special: project?.what_special || '',
    long_description: project?.long_description || '',
    url: project?.url || '',
    published: project?.published || false,
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg mb-6">
      <h3 className="font-display text-lg font-medium text-slate-900 mb-4">
        {project ? 'Edit Project' : 'Add New Project'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div>
          <label className="form-label">URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="form-label">Short Description (Client Quote)</label>
        <input
          type="text"
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="What the client wanted to build..."
        />
      </div>

      <div className="mt-4">
        <label className="form-label">What's Special (Index Card Description)</label>
        <textarea
          name="what_special"
          value={formData.what_special}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="What makes this project unique and technically interesting..."
          rows="3"
        />
      </div>

      <div className="mt-4">
        <label className="form-label">Long Description (Case Study Details)</label>
        <textarea
          name="long_description"
          value={formData.long_description}
          onChange={handleChange}
          required
          className="form-textarea"
          placeholder="Full technical details, challenge, and solution..."
        />
      </div>

      <div className="mt-4">
        <label className="form-label">Project Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="form-input"
        />
      </div>

      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm text-slate-700">Published</span>
        </label>
      </div>

      <div className="flex space-x-3 mt-6">
        <button type="submit" className="btn-primary">
          {project ? 'Update Project' : 'Create Project'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.adminData?.messages) {
      setMessages(window.adminData.messages);
      setLoading(false);
    }
  }, []);

  const handleMarkAsRead = async (message) => {
    try {
      const response = await fetch(`/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: JSON.stringify({
          message: { read: true }
        })
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(m => 
          m.id === message.id ? updatedMessage : m
        ));
        if (selectedMessage && selectedMessage.id === message.id) {
          setSelectedMessage(updatedMessage);
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (message) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/admin/messages/${message.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        }
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== message.id));
        if (selectedMessage && selectedMessage.id === message.id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-medium text-slate-900">
          Contact Messages
        </h2>
        <div className="text-sm text-slate-500">
          {messages.filter(m => !m.read).length} unread
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="font-display text-lg font-medium text-slate-900 mb-2">No messages yet</h3>
          <p className="text-slate-500">Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.map(message => (
              <MessageCard
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onSelect={setSelectedMessage}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-4">
            {selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <p className="text-slate-500">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageCard({ message, isSelected, onSelect, onMarkAsRead, onDelete, formatDate }) {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-slate-900 bg-slate-50' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
      onClick={() => onSelect(message)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-slate-900 truncate">
              {message.name}
            </h3>
            {!message.read && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-1">{message.email}</p>
          <p className="text-sm font-medium text-slate-800 mb-2 line-clamp-1">
            {message.subject}
          </p>
          <p className="text-xs text-slate-500">
            {formatDate(message.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageDetail({ message, onMarkAsRead, onDelete, formatDate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-medium text-slate-900 mb-1">
            {message.name}
          </h2>
          <p className="text-slate-600">{message.email}</p>
        </div>
        <div className="flex space-x-2">
          {!message.read && (
            <button
              onClick={() => onMarkAsRead(message)}
              className="text-sm text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => onDelete(message)}
            className="text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-slate-900 mb-2">Subject</h3>
        <p className="text-slate-700">{message.subject}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-slate-900 mb-2">Message</h3>
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
      
      <div className="text-xs text-slate-500 border-t pt-4">
        Received: {formatDate(message.created_at)}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <a 
          href={`mailto:${message.email}?subject=Re: ${message.subject}`}
          className="btn-primary inline-block"
        >
          Reply via Email
        </a>
      </div>
    </div>
  );
}

function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.adminData?.blogPosts) {
      setPosts(window.adminData.blogPosts);
      setLoading(false);
    }
  }, []);

  const handleSave = async (postData) => {
    try {
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(`blog_post[${key}]`, postData[key]);
        }
      });

      const url = editingPost 
        ? `/admin/blog_posts/${editingPost.id}`
        : '/admin/blog_posts';
      
      const method = editingPost ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: formData
      });

      if (response.ok) {
        const savedPost = await response.json();
        
        if (editingPost) {
          setPosts(posts.map(p => 
            p.id === editingPost.id ? savedPost : p
          ));
        } else {
          setPosts([savedPost, ...posts]);
        }
        
        setEditingPost(null);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        alert('Error saving post: ' + (errorData.errors || ['Unknown error']).join(', '));
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const handleDelete = async (post) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/admin/blog_posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        }
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== post.id));
      } else {
        alert('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const togglePublished = async (post) => {
    try {
      const formData = new FormData();
      formData.append('blog_post[published]', !post.published);

      const response = await fetch(`/admin/blog_posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: formData
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => 
          p.id === post.id ? updatedPost : p
        ));
      } else {
        alert('Error updating post status');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post status');
    }
  };

  const toggleFeatured = async (post) => {
    try {
      const formData = new FormData();
      formData.append('blog_post[featured]', !post.featured);

      const response = await fetch(`/admin/blog_posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: formData
      });

      if (response.ok) {
        const updatedPost = await response.json();
        // Update all posts, as featuring one may un-feature another
        const updatedPosts = posts.map(p => {
          if (p.id === post.id) {
            return updatedPost;
          } else if (updatedPost.featured && p.featured) {
            // If the updated post is featured, un-feature any other featured posts
            return { ...p, featured: false };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        alert('Error updating featured status');
      }
    } catch (error) {
      console.error('Error updating featured:', error);
      alert('Error updating featured status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-500">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-medium text-slate-900">
          Blog Posts
        </h2>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowForm(true);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          New Post
        </button>
      </div>

      {showForm && (
        <BlogPostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="font-display text-lg font-medium text-slate-900 mb-2">No blog posts yet</h3>
          <p className="text-slate-500">Create your first blog post to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={(post) => {
                setEditingPost(post);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onTogglePublished={togglePublished}
              onToggleFeatured={toggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlogPostCard({ post, onEdit, onDelete, onTogglePublished, onToggleFeatured }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-slate-900 text-lg truncate">
              {post.title}
            </h3>
            <button
              onClick={() => onToggleFeatured(post)}
              className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                post.featured ? 'text-yellow-500' : 'text-slate-300'
              }`}
              title={post.featured ? 'Remove from featured' : 'Set as featured'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
          
          <p className="text-slate-600 mb-3 line-clamp-2">
            {post.teaser}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>
              {post.published ? (post.published_at ? `Published ${formatDate(post.published_at)}` : 'Published') : 'Draft'}
            </span>
            {post.featured_image_url && (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Featured image</span>
              </span>
            )}
            {post.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onTogglePublished(post)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              post.published
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
          
          <button
            onClick={() => onEdit(post)}
            className="text-sm text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>
          
          <button
            onClick={() => onDelete(post)}
            className="text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
          
          {post.published && (
            <a
              href={post.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function BlogPostForm({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    teaser: post?.teaser || '',
    content: post?.content || '',
    published: post?.published || false,
    featured_image: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
      <h3 className="font-display text-lg font-medium text-slate-900 mb-4">
        {post ? 'Edit Blog Post' : 'New Blog Post'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter blog post title..."
          />
        </div>

        <div>
          <label htmlFor="teaser" className="block text-sm font-medium text-slate-700 mb-1">
            Teaser
          </label>
          <textarea
            id="teaser"
            name="teaser"
            value={formData.teaser}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Brief description for the blog post..."
            rows="3"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Write your post in Markdown... 

# Headers
## Subheaders
**bold** *italic*
- Lists
- More items

| Tables | Work |
|--------|------|
| Cell 1 | Cell 2 |

```javascript
// Code blocks too!
console.log('Hello world');
```"
            rows="15"
          />
          <div className="mt-2 text-sm text-slate-500">
            <p>You can use Markdown syntax:</p>
            <div className="grid grid-cols-2 gap-4 mt-1 text-xs">
              <div>
                <code># Header</code> → Header<br/>
                <code>## Subheader</code> → Subheader<br/>
                <code>**bold**</code> → <strong>bold</strong><br/>
                <code>*italic*</code> → <em>italic</em>
              </div>
              <div>
                <code>- List item</code> → • List item<br/>
                <code>[Link](url)</code> → Link<br/>
                <code>`code`</code> → <code>code</code><br/>
                <code>```code block```</code> → Code block
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-slate-700 mb-1">
            Featured Image
          </label>
          <input
            type="file"
            id="featured_image"
            name="featured_image"
            onChange={handleChange}
            accept="image/*"
            className="form-input"
          />
          {post?.featured_image_url && (
            <div className="mt-2">
              <img 
                src={post.featured_image_url} 
                alt="Current featured image" 
                className="w-32 h-32 object-cover rounded border"
              />
              <p className="text-sm text-slate-500 mt-1">Current featured image</p>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span className="ml-2 text-sm text-slate-700">Publish immediately</span>
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {post ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ProposalManager() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.adminData?.proposalRequests) {
      setProposals(window.adminData.proposalRequests);
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (proposal, newStatus) => {
    try {
      const response = await fetch(`/admin/proposal_requests/${proposal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: JSON.stringify({
          proposal_request: { status: newStatus }
        })
      });

      if (response.ok) {
        const updatedProposal = await response.json();
        setProposals(proposals.map(p => 
          p.id === proposal.id ? updatedProposal : p
        ));
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(updatedProposal);
        }
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
    }
  };

  const handleNotesUpdate = async (proposal, notes) => {
    try {
      const response = await fetch(`/admin/proposal_requests/${proposal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': window.adminData.csrfToken
        },
        body: JSON.stringify({
          proposal_request: { internal_notes: notes }
        })
      });

      if (response.ok) {
        const updatedProposal = await response.json();
        setProposals(proposals.map(p => 
          p.id === proposal.id ? updatedProposal : p
        ));
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(updatedProposal);
        }
      }
    } catch (error) {
      console.error('Error updating proposal notes:', error);
    }
  };

  const handleDelete = async (proposal) => {
    if (!confirm('Are you sure you want to delete this proposal request?')) return;

    try {
      const response = await fetch(`/admin/proposal_requests/${proposal.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': window.adminData.csrfToken
        }
      });

      if (response.ok) {
        setProposals(proposals.filter(p => p.id !== proposal.id));
        if (selectedProposal && selectedProposal.id === proposal.id) {
          setSelectedProposal(null);
        }
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (score) => {
    if (score >= 5) return 'text-red-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className="text-slate-500">Loading proposals...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-medium text-slate-900">
          Proposal Requests
        </h2>
        <div className="text-sm text-slate-500">
          {proposals.filter(p => p.status === 'submitted').length} new submissions
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="font-display text-lg font-medium text-slate-900 mb-2">No proposals yet</h3>
          <p className="text-slate-500">Proposal requests will appear here when submitted</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposals List */}
          <div className="space-y-4">
            {proposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                isSelected={selectedProposal?.id === proposal.id}
                onSelect={setSelectedProposal}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>

          {/* Proposal Detail */}
          <div className="lg:sticky lg:top-4">
            {selectedProposal ? (
              <ProposalDetail
                proposal={selectedProposal}
                onStatusUpdate={handleStatusUpdate}
                onNotesUpdate={handleNotesUpdate}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <p className="text-slate-500">Select a proposal to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalCard({ proposal, isSelected, onSelect, onStatusUpdate, onDelete, getStatusColor, getPriorityColor }) {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-slate-900 bg-slate-50' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
      onClick={() => onSelect(proposal)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-slate-900 truncate">
              {proposal.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
              {proposal.status_display}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">{proposal.email}</p>
          {proposal.company && (
            <p className="text-sm text-slate-500 mb-2">{proposal.company}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className={`text-xs font-medium ${getPriorityColor(proposal.priority_score)}`}>
            Priority: {proposal.priority_score}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-3">
        <div>
          <span className="font-medium">Type:</span><br/>
          {proposal.project_type}
        </div>
        <div>
          <span className="font-medium">Budget:</span><br/>
          {proposal.budget_range}
        </div>
        <div>
          <span className="font-medium">Timeline:</span><br/>
          {proposal.timeline}
        </div>
      </div>
      
      <p className="text-sm text-slate-700 line-clamp-2 mb-2">
        {proposal.short_description}
      </p>
      
      <p className="text-xs text-slate-500">
        {proposal.created_at_formatted}
      </p>
    </div>
  );
}

function ProposalDetail({ proposal, onStatusUpdate, onNotesUpdate, onDelete, getStatusColor, getPriorityColor }) {
  const [notes, setNotes] = useState(proposal.internal_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    setIsSavingNotes(true);
    await onNotesUpdate(proposal, notes);
    setIsSavingNotes(false);
  };

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-medium text-slate-900 mb-1">
            {proposal.name}
          </h2>
          <p className="text-slate-600">{proposal.email}</p>
          {proposal.company && (
            <p className="text-slate-500 text-sm">{proposal.company}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
            {proposal.status_display}
          </span>
          <span className={`text-sm font-medium ${getPriorityColor(proposal.priority_score)}`}>
            Priority: {proposal.priority_score}
          </span>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-900">Project Type:</span>
            <p className="text-slate-600">{proposal.project_type}</p>
          </div>
          <div>
            <span className="font-medium text-slate-900">Budget Range:</span>
            <p className="text-slate-600">{proposal.budget_range}</p>
          </div>
          <div>
            <span className="font-medium text-slate-900">Timeline:</span>
            <p className="text-slate-600">{proposal.timeline}</p>
          </div>
        </div>

        <div>
          <span className="font-medium text-slate-900 text-sm">Project Description:</span>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">{proposal.project_description}</p>
        </div>

        {proposal.existing_website && (
          <div>
            <span className="font-medium text-slate-900 text-sm">Existing Website:</span>
            <p className="text-slate-600 text-sm mt-1">
              <a href={proposal.existing_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {proposal.existing_website}
              </a>
            </p>
          </div>
        )}

        {proposal.target_audience && (
          <div>
            <span className="font-medium text-slate-900 text-sm">Target Audience:</span>
            <p className="text-slate-600 text-sm mt-1">{proposal.target_audience}</p>
          </div>
        )}

        {proposal.special_requirements && (
          <div>
            <span className="font-medium text-slate-900 text-sm">Special Requirements:</span>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{proposal.special_requirements}</p>
          </div>
        )}

        {proposal.why_custom && (
          <div>
            <span className="font-medium text-slate-900 text-sm">Why Custom:</span>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{proposal.why_custom}</p>
          </div>
        )}

        {proposal.success_metrics && (
          <div>
            <span className="font-medium text-slate-900 text-sm">Success Metrics:</span>
            <p className="text-slate-600 text-sm mt-1">{proposal.success_metrics}</p>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="border-t pt-4 mb-4">
        <label className="block text-sm font-medium text-slate-900 mb-2">Update Status:</label>
        <select 
          value={proposal.status}
          onChange={(e) => onStatusUpdate(proposal, e.target.value)}
          className="form-input text-sm"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Internal Notes */}
      <div className="border-t pt-4 mb-4">
        <form onSubmit={handleNotesSubmit}>
          <label className="block text-sm font-medium text-slate-900 mb-2">Internal Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input text-sm"
            rows="4"
            placeholder="Add internal notes about this proposal..."
          />
          <button
            type="submit"
            disabled={isSavingNotes}
            className="mt-2 text-sm bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSavingNotes ? 'Saving...' : 'Save Notes'}
          </button>
        </form>
      </div>

      {/* Actions */}
      <div className="border-t pt-4 flex justify-between">
        <a 
          href={`mailto:${proposal.email}?subject=Re: Your Project Proposal`}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Reply via Email
        </a>
        
        <button
          onClick={() => onDelete(proposal)}
          className="text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="text-xs text-slate-500 mt-4 pt-4 border-t">
        Submitted: {proposal.created_at_formatted}
      </div>
    </div>
  );
}

// Initialize the React components when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.getElementById('admin-projects-manager');
  if (projectsContainer && window.adminData) {
    const root = createRoot(projectsContainer);
    root.render(<ProjectManager />);
  }

  const messagesContainer = document.getElementById('admin-messages-manager');
  if (messagesContainer && window.adminData) {
    const root = createRoot(messagesContainer);
    root.render(<MessageManager />);
  }

  const blogContainer = document.getElementById('admin-blog-manager');
  if (blogContainer && window.adminData) {
    const root = createRoot(blogContainer);
    root.render(<BlogManager />);
  }

  const proposalContainer = document.getElementById('admin-proposal-manager');
  if (proposalContainer && window.adminData) {
    const root = createRoot(proposalContainer);
    root.render(<ProposalManager />);
  }
});

export default ProjectManager;