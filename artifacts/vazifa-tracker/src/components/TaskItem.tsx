import { formatTime } from "../utils/time";

export const TaskItem = ({ task }: { task: { id: number; text: string; time: string } }) => {
  return (
    <div className="bg-gray-200 p-2 rounded-md flex justify-between items-center">
      <span>{task.text}</span>
      <span className="text-xs text-gray-500">{formatTime(task.time)}</span>
    </div>
  );
};