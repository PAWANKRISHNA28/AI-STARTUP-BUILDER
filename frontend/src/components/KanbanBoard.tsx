import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreVertical, Calendar } from 'lucide-react';
import { m } from 'framer-motion';

// Mock Data
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Finalize Pitch Deck', priority: 'high', assignee: 'Founder' },
    'task-2': { id: 'task-2', content: 'Design App Wireframes', priority: 'medium', assignee: 'Sarah J.' },
    'task-3': { id: 'task-3', content: 'Setup PostgreSQL DB', priority: 'high', assignee: 'AI Backend' },
    'task-4': { id: 'task-4', content: 'Draft Terms of Service', priority: 'low', assignee: 'Legal AI' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Backlog',
      taskIds: ['task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Todo',
      taskIds: ['task-1', 'task-2'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

export const KanbanBoard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish = data.columns[destination.droppableId as keyof typeof data.columns];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving between columns
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const priorityColors = {
    high: 'text-rose-500 bg-rose-50 border-rose-200',
    medium: 'text-amber-500 bg-amber-50 border-amber-200',
    low: 'text-emerald-500 bg-emerald-50 border-emerald-200'
  };

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Project Kanban</h2>
          <p className="text-sm text-muted-foreground">Manage startup tasks, features, and milestones.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold shadow-apple hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-none">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId as keyof typeof data.columns];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId as keyof typeof data.tasks]);

              return (
                <div key={column.id} className="flex flex-col w-[300px] shrink-0 h-full">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {column.title}
                      <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] text-muted-foreground font-mono">
                        {tasks.length}
                      </span>
                    </h3>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto scrollbar-none glass-panel p-3 rounded-2xl transition-colors border border-border/50 ${
                          snapshot.isDraggingOver ? 'bg-muted/50 border-blue-500/30' : 'bg-muted/10'
                        }`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 bg-background border rounded-xl transition-shadow group ${
                                  snapshot.isDragging ? 'shadow-xl border-blue-500 rotate-2 opacity-90' : 'shadow-sm border-border/50 hover:border-border'
                                }`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                    {task.priority}
                                  </span>
                                  <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-sm font-semibold text-foreground mb-4 leading-tight">{task.content}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>TBD</span>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[9px] border border-blue-200" title={task.assignee}>
                                    {task.assignee.charAt(0)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};
