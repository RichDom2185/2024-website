/* @jsxImportSource solid-js */
import clsx from 'clsx';
import { type Component, type ComponentProps, createMemo } from 'solid-js';

type Props = {
  label: string | (() => string);
  onClick?: () => void;
  getEnabledState?: () => boolean;
  leftIcon?: string;
  rightIcon?: string;
  buttonProps?: ComponentProps<'button'>;
};

// Simplified version of
// https://github.com/RichDom2185/2023-website/blob/main/src/components/common/Button.tsx
const SimpleButton: Component<Props> = ({
  label,
  onClick = () => {},
  leftIcon,
  rightIcon,
  buttonProps = {},
}) => {
  const text = createMemo(() => (typeof label === 'string' ? label : label()));

  return (
    <button
      {...buttonProps}
      class={clsx(
        'px-2 py-1 transition',
        'select-none rounded',
        'hover:shadow-md',
        'hover:text-white dark:hover:text-stone-900',
        'hover:bg-blue-600 dark:hover:bg-zinc-100'
      )}
      onClick={onClick}
    >
      {/* @ts-expect-error web component */}
      {leftIcon && <iconify-icon inline icon={leftIcon} />}
      {leftIcon && ' '}
      {text()}
      {rightIcon && ' '}
      {/* @ts-expect-error web component */}
      {rightIcon && <iconify-icon inline icon={rightIcon} />}
    </button>
  );
};

export default SimpleButton;
