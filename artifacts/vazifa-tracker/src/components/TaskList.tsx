import { TaskItem } from "./TaskItem";

export const TaskList = ({ tasks }: { tasks: { id: number; text: string; time: string }[] }) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};