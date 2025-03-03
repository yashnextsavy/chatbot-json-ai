
import { useRive, useStateMachineInput } from 'rive-react';
import { useEffect } from 'react';

export default function RiveAnimatedAvatar({ animation, size = 60, animationState = 'idle', trigger = null }) {
  const { rive, RiveComponent } = useRive({
    src: `/assets/animations/${animation}.riv`,
    stateMachines: 'State Machine',
    autoplay: true,
  });

  // Get state machine inputs
  const stateInput = rive ? useStateMachineInput(rive, 'State Machine', 'state') : null;
  const triggerInput = trigger && rive ? useStateMachineInput(rive, 'State Machine', trigger, false) : null;

  // Update animation state when prop changes
  useEffect(() => {
    if (stateInput) {
      stateInput.value = animationState;
    }
  }, [animationState, stateInput]);

  // Trigger animation when trigger prop is true
  useEffect(() => {
    if (triggerInput && trigger) {
      triggerInput.fire();
    }
  }, [trigger, triggerInput]);

  return (
    <div style={{ width: `${size}px`, height: `${size}px` }}>
      <RiveComponent />
    </div>
  );
}
