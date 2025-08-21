export const taskService = {
  async getAllTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "upload_history_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 20,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error.response.data.message);
      } else {
        console.error("Error fetching tasks:", error);
      }
      throw error;
    }
  },

  async getTaskById(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "upload_history_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("task_c", taskId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${taskId}:`, error.response.data.message);
      } else {
        console.error(`Error fetching task with ID ${taskId}:`, error);
      }
      return null;
    }
  },

  async createTask(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const taskRecord = {
        Name: taskData.Name || taskData.title_c || 'New Task',
        title_c: taskData.title_c,
        description_c: taskData.description_c || '',
        Tags: taskData.Tags || '',
        upload_history_c: taskData.upload_history_c ? parseInt(taskData.upload_history_c) : null
      };

      // Remove null values
      Object.keys(taskRecord).forEach(key => {
        if (taskRecord[key] === null || taskRecord[key] === undefined) {
          delete taskRecord[key];
        }
      });
      
      const params = {
        records: [taskRecord]
      };
      
      const response = await apperClient.createRecord("task_c", params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error("Failed to create task");
          }
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error.response.data.message);
      } else {
        console.error("Error creating task:", error);
      }
      throw error;
    }
  },

  async updateTask(taskId, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields plus Id
      const taskRecord = {
        Id: parseInt(taskId),
        Name: taskData.Name || taskData.title_c || 'Updated Task',
        title_c: taskData.title_c,
        description_c: taskData.description_c || '',
        Tags: taskData.Tags || '',
        upload_history_c: taskData.upload_history_c ? parseInt(taskData.upload_history_c) : null
      };

      // Remove null values except Id
      Object.keys(taskRecord).forEach(key => {
        if (key !== 'Id' && (taskRecord[key] === null || taskRecord[key] === undefined)) {
          delete taskRecord[key];
        }
      });
      
      const params = {
        records: [taskRecord]
      };
      
      const response = await apperClient.updateRecord("task_c", params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(record.message);
          });
          
          if (successfulUpdates.length === 0) {
            throw new Error("Failed to update task");
          }
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error.response.data.message);
      } else {
        console.error("Error updating task:", error);
      }
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(taskId)]
      };
      
      const response = await apperClient.deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Failed to delete task");
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error.response.data.message);
      } else {
        console.error("Error deleting task:", error);
      }
      throw error;
    }
  },

  async deleteTasks(taskIds) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: taskIds.map(id => parseInt(id))
      };
      
      const response = await apperClient.deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error("Error deleting tasks:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length === taskIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tasks:", error.response.data.message);
      } else {
        console.error("Error deleting tasks:", error);
      }
      throw error;
    }
  }
};