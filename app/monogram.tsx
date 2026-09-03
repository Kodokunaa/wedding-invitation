export default function Monogram() {
  return (
    <svg className="bl-monogram" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* A shared upright joins the B bowls to the sweeping L foot. */}
      <path fill="currentColor" fillRule="evenodd" d="M23 17H48C68 17 77 25 77 37C77 46 71 52 61 54C75 56 83 63 83 73C83 86 72 92 51 92H23V89H30V20H23V17ZM39 21V52H47C61 52 68 47 68 37C68 26 61 21 48 21H39ZM39 56V87H50C66 87 74 83 74 72C74 61 65 56 49 56H39Z"/>
      <path d="M17 8H48M34 9V78C34 83 37 86 44 86H65C78 86 86 81 91 68" stroke="var(--monogram-cutout, #f7f5ef)" strokeWidth="8"/>
      <path d="M17 8H48M34 9V78C34 83 37 86 44 86H65C78 86 86 81 91 68" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
    </svg>
  );
}
