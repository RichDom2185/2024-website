/* @jsxImportSource solid-js */
import clsx from 'clsx';
import { type Component, createSignal } from 'solid-js';
import { sendMessage } from 'src/utilities/api/contact';
import SimpleButton from '../common/SimpleButton.solid';

const formComponentClasses = 'w-full flex gap-x-6 items-center';
const labelClasses = clsx(
  'w-1/5 text-right text-sm leading-tight',
  'hidden md:block',
  'TEXT_MEDIUM'
);
const inputClasses = clsx(
  'w-full rounded px-3 py-2',
  'bg-white dark:bg-slate-700 dark:bg-opacity-20',
  'shadow-none',
  ['TEXT_STATIC_BLACK', 'dark:text-stone-300 font-normal']
);

// TODO: Refactor into form components
const ContactForm: Component = () => {
  const [getEmailValue, setEmailValue] = createSignal('');
  const [getTelegramValue, setTelegramValue] = createSignal('');
  const [getMessageValue, setMessageValue] = createSignal('');

  const shouldWarn = () =>
    !getEmailValue() && !getTelegramValue() && getMessageValue();

  const handleSubmit = () => {
    const email = getEmailValue() || undefined;
    const telegram = getTelegramValue() || undefined;

    const message = getMessageValue();
    sendMessage(email, telegram, message)
      .then(() => {
        alert('Your message has been sent!');
      })
      .catch(() => {
        alert('Something went wrong, please try again later.');
      });
  };

  return (
    <div class="w-full lg:w-2/3 mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div
          class={clsx(
            'flex flex-col gap-y-4',
            'px-4 py-4',
            'bg-slate-100 dark:bg-slate-700',
            'bg-opacity-95 shadow-md dark:bg-opacity-20',
            'TEXT_DYNAMIC_COLOR',
            'rounded-lg'
          )}
        >
          <div class="flex flex-col gap-y-1">
            {/* email */}
            <div class={formComponentClasses}>
              <div class={labelClasses}>
                <label for="email">
                  Your Email
                  <br />
                  <span class={clsx('text-xs', 'TEXT_NORMAL')}>(optional)</span>
                </label>
              </div>
              <div class="w-full">
                <input
                  class={inputClasses}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={getEmailValue()}
                  onInput={(e) => setEmailValue(e.currentTarget.value)}
                />
              </div>
            </div>
            {/* telegram username */}
            <div class={formComponentClasses}>
              <div class={labelClasses}>
                <label for="telegram">
                  Telegram ID
                  <br />
                  <span class={clsx('text-xs', 'TEXT_NORMAL')}>(optional)</span>
                </label>
              </div>
              <div class="w-full">
                <input
                  class={inputClasses}
                  type="text"
                  name="telegram"
                  id="telegram"
                  placeholder="Telegram ID"
                  value={getTelegramValue()}
                  onInput={(e) => setTelegramValue(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
          {/* message */}
          <div class={formComponentClasses}>
            <div class={labelClasses}>
              <label for="message">
                Message<sup class="text-red-500">*</sup>
              </label>
            </div>
            <div class="w-full">
              <textarea
                class={clsx(inputClasses, 'h-64 resize-y')}
                required
                name="message"
                id="message"
                placeholder="Message"
                value={getMessageValue()}
                onInput={(e) => setMessageValue(e.currentTarget.value)}
              />
            </div>
          </div>
          {shouldWarn() && (
            // TODO: Refactor into generic "modal" component
            <div
              class={clsx(
                'bg-orange-50 dark:bg-yellow-800 dark:bg-opacity-20',
                'outline outline-orange-600',
                'dark:text-stone-300',
                'px-4 py-3 space-y-2',
                'rounded'
              )}
            >
              <p class="text-justify">
                <strong class="text-2xl text-orange-700 dark:text-orange-400">
                  Note:
                </strong>
                <br />
                You seem to be sending a message without providing any contact
                details. Without any contact details, I will not be able to
                reply to your message!
              </p>
              <p>Please ensure that either:</p>
              <ul>
                <li class="list-disc list-inside">
                  You{' '}
                  <strong class={clsx('TEXT_BOLD', 'tracking-wide')}>
                    do not require a response
                  </strong>{' '}
                  in return, or
                </li>
                <li class="list-disc list-inside">
                  You have included a{' '}
                  <strong class={clsx('TEXT_BOLD', 'tracking-wide')}>
                    means of contact
                  </strong>{' '}
                  in the message body.
                </li>
              </ul>
            </div>
          )}
          <div class="mx-auto">
            <SimpleButton
              leftIcon="fluent:send-32-filled"
              label={() =>
                shouldWarn()
                  ? 'I have checked my message, proceed to send'
                  : 'Send Message'
              }
              buttonProps={{ type: 'submit' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
