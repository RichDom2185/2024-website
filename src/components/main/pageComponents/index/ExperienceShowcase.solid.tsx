/* @jsxImportSource solid-js */
import clsx from 'clsx';
import { type Component, For, createSignal } from 'solid-js';

type Props = {
  category: string;
  summaries: string[];
  descriptions: string[];
  initialIndex?: number;
  flipped?: boolean;
};

const ExperienceShowcase: Component<Props> = ({
  category,
  summaries,
  descriptions,
  initialIndex = 0,
  flipped = false,
}) => {
  const [getSelectedIndex, setSelectedIndex] = createSignal(initialIndex);

  return (
    <div
      class={clsx(
        'flex gap-x-8 justify-between',
        flipped && 'flex-row-reverse'
      )}
    >
      <div class="w-[100%]">
        <div class="space-y-4">
          <h2
            class={clsx(
              'text-2xl text-center font-display tracking-wider',
              'TEXT_MEDIUM'
            )}
          >
            {category}
          </h2>
          <div class="space-y-1">
            <For each={summaries}>
              {(_, i) => (
                <div
                  class={clsx(
                    'py-2 px-3',
                    'rounded-lg',
                    'transition-all duration-50',
                    'cursor-pointer',
                    // Adapted from Classes.HOVER_DYNAMIC_BACKGROUND,
                    // TODO: Match the colors to the description
                    'hover:bg-black/10 dark:hover:bg-white/10',
                    getSelectedIndex() === i() && 'bg-black/5 dark:bg-white/5'
                  )}
                  onClick={() => setSelectedIndex(i())}
                  innerHTML={summaries[i()]}
                />
              )}
            </For>
          </div>
        </div>
      </div>
      <div
        class="w-[200%] px-6 py-4 bg-stone-500 bg-opacity-5"
        innerHTML={descriptions[getSelectedIndex()]}
      />
    </div>
  );
};

export default ExperienceShowcase;
