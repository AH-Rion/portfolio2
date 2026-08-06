import { useRef, type ReactNode } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { useImageUpload } from '@/lib/upload';

interface Props {
  label: string;
  folder: string;
  url: string | null | undefined;
  onChange: (url: string) => void;
  aspect?: string;
}

export default function ImageUploader({ label, folder, url, onChange, aspect = 'aspect-video' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, handle } = useImageUpload(folder, onChange);

  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]`}
      >
        {url ? (
          <>
            <img src={url} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-ink-950/80 text-slate-300 hover:text-fuchsia-400"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="grid h-full w-full place-items-center text-slate-500 transition-colors hover:text-cyan-300"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="font-mono text-xs">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span className="font-mono text-xs">Click to upload</span>
              </div>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.02] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate-400">
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/15"
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/15"
    />
  );
}

export function Button({
  children,
  variant = 'primary',
  ...rest
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition-all disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-glow to-electric-glow text-ink-950 hover:shadow-glow-cyan'
      : variant === 'danger'
      ? 'border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/10'
      : 'border border-white/15 text-slate-200 hover:border-cyan-glow/40 hover:text-cyan-300';
  return (
    <button {...rest} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
