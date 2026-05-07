type Props = { name: string; avatarUrl: string; status: string };

export function WhatsAppBar({ name, avatarUrl, status }: Props) {
  return (
    <div className="tb-user-bar">
      <div className="tb-back">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </div>
      <div className="tb-avatar">
        <img src={avatarUrl} alt={name} />
      </div>
      <div className="tb-name">
        <span>{name}</span>
        <span className="tb-verified-icon">
          <svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet">
            <polygon
              fill="#00DA60"
              points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9 "
            />
            <polygon fill="#FFFFFF" points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4 " />
          </svg>
        </span>
        <span className="tb-status">{status}</span>
      </div>
    </div>
  );
}
