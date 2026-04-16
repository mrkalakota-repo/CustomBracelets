import Link from 'next/link'
import { AdminGuard } from '@/components/Admin/AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="page-container py-8 min-h-screen">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <Link href="/admin" className="text-2xl font-bold text-text-dark hover:text-sage transition-colors">
            Admin
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/admin/products" className="text-text-dark hover:text-sage transition-colors">
              Products
            </Link>
            <Link href="/admin/drops" className="text-text-dark hover:text-sage transition-colors">
              Drops
            </Link>
            <Link href="/admin/banners" className="text-text-dark hover:text-sage transition-colors">
              Banners
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </AdminGuard>
  )
}
