export default function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-zinc-600">{text}</p>}
    </div>
  );
}