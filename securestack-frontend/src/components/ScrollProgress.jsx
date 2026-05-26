import { useScrollProgress } from '../hooks/useAnimations';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
  );
}
