import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { uploadService } from '@/services/api/uploadService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await taskService.getAllTasks();
      setTasks(taskData || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error(err.message || 'Failed to delete task');
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
      return;
    }
    
    try {
      setDeleting(true);
      const success = await taskService.deleteTasks(selectedTasks);
      if (success) {
        setTasks(tasks.filter(task => !selectedTasks.includes(task.Id)));
        setSelectedTasks([]);
        toast.success(`${selectedTasks.length} task(s) deleted successfully`);
      } else {
        toast.error('Some tasks could not be deleted');
        // Refresh to get current state
        await loadTasks();
        setSelectedTasks([]);
      }
    } catch (err) {
      console.error('Error deleting tasks:', err);
      toast.error(err.message || 'Failed to delete tasks');
      await loadTasks();
      setSelectedTasks([]);
    } finally {
      setDeleting(false);
    }
  };
  
  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === filteredTasks.length 
        ? [] 
        : filteredTasks.map(task => task.Id)
    );
  };
  
  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title_c?.toLowerCase().includes(searchLower) ||
      task.description_c?.toLowerCase().includes(searchLower) ||
      task.Tags?.toLowerCase().includes(searchLower)
    );
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="mt-2 text-gray-600">Manage your tasks and file attachments</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline">
                  <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Files
                </Button>
              </Link>
              <Link to="/tasks/new">
                <Button>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search and Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {selectedTasks.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedTasks.length} selected
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  ) : (
                    <ApperIcon name="Trash2" size={16} className="mr-2" />
                  )}
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Empty
            title={searchTerm ? "No tasks found" : "No tasks yet"}
            description={searchTerm ? "Try adjusting your search terms" : "Create your first task to get started"}
            action={!searchTerm ? {
              label: "Create Task",
              onClick: () => navigate('/tasks/new')
            } : null}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === filteredTasks.length}
                  onChange={handleSelectAll}
                  className="mr-4 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="grid grid-cols-6 gap-4 flex-1">
                  <div className="col-span-3">
                    <span className="text-sm font-medium text-gray-700">Task</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-700">Attached File</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-700">Created</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-700">Actions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Task Items */}
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.Id)}
                      onChange={() => handleSelectTask(task.Id)}
                      className="mr-4 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="grid grid-cols-6 gap-4 flex-1">
                      {/* Task Info */}
                      <div className="col-span-3">
                        <Link
                          to={`/tasks/${task.Id}`}
                          className="block hover:text-primary-600 transition-colors duration-200"
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {task.title_c || task.Name || 'Untitled Task'}
                          </h3>
                          {task.description_c && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description_c}
                            </p>
                          )}
                          {task.Tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {task.Tags.split(',').map((tag, idx) => (
                                <Badge key={idx} size="sm" variant="primary">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Link>
                      </div>
                      
                      {/* Attached File */}
                      <div className="col-span-1">
                        {task.upload_history_c?.Name ? (
                          <div className="text-sm text-gray-600">
                            <ApperIcon name="Paperclip" size={14} className="inline mr-1" />
                            {task.upload_history_c.Name}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No file</span>
                        )}
                      </div>
                      
                      {/* Created Date */}
                      <div className="col-span-1">
                        <span className="text-sm text-gray-600">
                          {format(new Date(task.CreatedOn), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                          <Link to={`/tasks/${task.Id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit task">
                              <ApperIcon name="Edit" size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.Id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete task"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;