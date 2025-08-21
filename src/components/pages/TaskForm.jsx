import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { uploadService } from '@/services/api/uploadService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    Tags: '',
    upload_history_c: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  
  useEffect(() => {
    loadUploadFiles();
    if (isEdit) {
      loadTask();
    }
  }, [id, isEdit]);
  
  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await taskService.getTaskById(id);
      if (taskData) {
        setFormData({
          title_c: taskData.title_c || '',
          description_c: taskData.description_c || '',
          Tags: taskData.Tags || '',
          upload_history_c: taskData.upload_history_c?.Id || ''
        });
      } else {
        setError('Task not found');
      }
    } catch (err) {
      console.error('Error loading task:', err);
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };
  
  const loadUploadFiles = async () => {
    try {
      const files = await uploadService.getUploadHistory();
      setUploadFiles(files || []);
    } catch (err) {
      console.error('Error loading upload files:', err);
      // Don't show error for upload files, it's optional
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title_c.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    try {
      setSaving(true);
      
      const taskData = {
        title_c: formData.title_c.trim(),
        description_c: formData.description_c.trim(),
        Tags: formData.Tags.trim(),
        upload_history_c: formData.upload_history_c || null
      };
      
      if (isEdit) {
        await taskService.updateTask(id, taskData);
        toast.success('Task updated successfully');
        navigate(`/tasks/${id}`);
      } else {
        const newTask = await taskService.createTask(taskData);
        toast.success('Task created successfully');
        navigate(newTask ? `/tasks/${newTask.Id}` : '/tasks');
      }
    } catch (err) {
      console.error('Error saving task:', err);
      toast.error(err.message || `Failed to ${isEdit ? 'update' : 'create'} task`);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={isEdit ? loadTask : undefined} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link to={isEdit ? `/tasks/${id}` : '/tasks'}>
              <Button variant="ghost" size="icon">
                <ApperIcon name="ArrowLeft" size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit Task' : 'Create New Task'}
              </h1>
              <p className="mt-1 text-gray-600">
                {isEdit ? 'Update task details' : 'Fill in the details to create a new task'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label htmlFor="title_c" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title_c"
                name="title_c"
                required
                value={formData.title_c}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter task title..."
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description_c" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description_c"
                name="description_c"
                rows={4}
                value={formData.description_c}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Enter task description..."
              />
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="Tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter tags separated by commas..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate multiple tags with commas (e.g., urgent, project, review)
              </p>
            </div>
            
            {/* Attached File */}
            <div>
              <label htmlFor="upload_history_c" className="block text-sm font-medium text-gray-700 mb-2">
                Attach File (Optional)
              </label>
              <select
                id="upload_history_c"
                name="upload_history_c"
                value={formData.upload_history_c}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No file attachment</option>
                {uploadFiles.map(file => (
                  <option key={file.Id} value={file.Id}>
                    {file.Name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select a file from your upload history to attach to this task
              </p>
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link to={isEdit ? `/tasks/${id}` : '/tasks'}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <ApperIcon name={isEdit ? "Save" : "Plus"} size={16} className="mr-2" />
                    {isEdit ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;