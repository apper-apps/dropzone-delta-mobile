import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);
  
  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await taskService.getTaskById(id);
      if (taskData) {
        setTask(taskData);
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
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      setDeleting(true);
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error || 'Task not found'} onRetry={loadTask} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/tasks">
                <Button variant="ghost" size="icon">
                  <ApperIcon name="ArrowLeft" size={16} />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {task.title_c || task.Name || 'Untitled Task'}
                </h1>
                <p className="mt-1 text-gray-600">
                  Created {format(new Date(task.CreatedOn), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to={`/tasks/${task.Id}/edit`}>
                <Button variant="outline">
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Edit Task
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                )}
                Delete Task
              </Button>
            </div>
          </div>
        </div>
        
        {/* Task Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title and Tags */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {task.title_c || task.Name || 'Untitled Task'}
              </h2>
              
              {task.Tags && (
                <div className="flex flex-wrap gap-2">
                  {task.Tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="primary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Description */}
            {task.description_c && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {task.description_c}
                  </p>
                </div>
              </div>
            )}
            
            {/* Attached File */}
            {task.upload_history_c?.Name && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Attached File</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Paperclip" size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {task.upload_history_c.Name}
                      </p>
                      {task.upload_history_c.share_link_c && (
                        <Link
                          to={task.upload_history_c.share_link_c}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View File
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created by</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.CreatedBy?.Name || 'Unknown'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.Owner?.Name || 'Unassigned'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created on</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(task.CreatedOn), "MMMM d, yyyy 'at' h:mm a")}
                  </dd>
                </div>
                
                {task.ModifiedOn && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last modified</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(task.ModifiedOn), "MMMM d, yyyy 'at' h:mm a")}
                      {task.ModifiedBy?.Name && (
                        <span className="text-gray-500 ml-1">
                          by {task.ModifiedBy.Name}
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;