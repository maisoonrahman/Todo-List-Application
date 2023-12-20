import React, { FC, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

interface Task {
  title: string;
  description: string;
  deadline: Date;
  priority: string;
  isComplete: boolean;
}

const TodoApp: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(-1);
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    deadline: new Date(),
    priority: 'low',
    isComplete: false,
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || !newTask.deadline) {
      toastr.error('Please fill in all required fields.', '', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }

    // Check if a task with the same title already exists
    const existingTask = tasks.find((task) => task.title === newTask.title);
    if (existingTask) {
      toastr.error(`Task with title "${newTask.title}" already exists.`, '', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }

    setTasks([...tasks, newTask]);
    setNewTask({
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'low',
      isComplete: false,
    });
    setOpenDialog(false);

    // Display success message when a task is added
    toastr.success('New task added successfully!', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  const handleEditTask = (index: number) => {
    setEditTaskIndex(index);
    setEditDialogOpen(true);

    const taskToEdit = tasks[index];
    setNewTask({ ...taskToEdit });
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedTaskIndex(-1);
    setNewTask({
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'low',
      isComplete: false,
    });
  };

  const handleUpdateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.deadline) {
      toastr.error('Please fill in all required fields.', '', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }

    const updatedTasks = tasks.map((task, index) =>
      index === editTaskIndex ? { ...newTask } : task
    );

    setTasks(updatedTasks);
    setEditDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'low',
      isComplete: false,
    });

    toastr.success('Task updated successfully!', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    toastr.success('Task deleted successfully!', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Frameworks
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon />}
          >
            Add Task
          </Button>
        </Toolbar>
      </AppBar>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Is Complete</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
              .filter((task) => !task.isComplete)
              .map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.deadline.toDateString()}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={task.isComplete}
                      onChange={() => handleTaskCompletion(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditTask(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle style={{ backgroundColor: '#2196f3', color: 'white' }}>
          <AddIcon style={{ marginRight: '10px' }} />
          Add Task
        </DialogTitle>
        <DialogContent>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <br />
          <input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <br />
          <DatePicker
            selected={newTask.deadline}
            onChange={(date: Date) =>
              setNewTask({ ...newTask, deadline: date })
            }
          />
          <br />
          <div>
            <label>
              Low
              <input
                type="radio"
                value="low"
                checked={newTask.priority === 'low'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
            <label>
              Medium
              <input
                type="radio"
                value="medium"
                checked={newTask.priority === 'medium'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
            <label>
              High
              <input
                type="radio"
                value="high"
                checked={newTask.priority === 'high'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle style={{ backgroundColor: '#2196f3', color: 'white' }}>
          <EditIcon style={{ marginRight: '10px' }} />
          Edit Task
        </DialogTitle>
        <DialogContent>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <br />
          <input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <br />
          <DatePicker
            selected={newTask.deadline}
            onChange={(date: Date) =>
              setNewTask({ ...newTask, deadline: date })
            }
          />
          <br />
          <div>
            <label>
              Low
              <input
                type="radio"
                value="low"
                checked={newTask.priority === 'low'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
            <label>
              Medium
              <input
                type="radio"
                value="medium"
                checked={newTask.priority === 'medium'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
            <label>
              High
              <input
                type="radio"
                value="high"
                checked={newTask.priority === 'high'}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              />
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TodoApp;
