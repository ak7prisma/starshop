export default function ServiceItem({ text }: Readonly<{ text: string }>) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-semibold text-indigo-400">•</span>
      <span className="text-slate-300">{text}</span>
    </div>
  );
}