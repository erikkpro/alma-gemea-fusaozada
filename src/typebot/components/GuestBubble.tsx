import { Check } from './Check';

type Props = { text: string; time: string };

export function GuestBubble({ text, time }: Props) {
  return (
    <div className="tb-guest-bubble">
      <div className="tb-bubble-text-guest">
        <span>{text}</span>
        <span className="tb-hora2">{time}</span>
        <Check />
      </div>
    </div>
  );
}
