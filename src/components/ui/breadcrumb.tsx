import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-400 mr-2">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-300 hover:text-[#00FFFF] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#00FFFF]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
