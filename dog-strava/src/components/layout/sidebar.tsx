'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ChartBarIcon,
    HomeIcon,
    PuzzlePieceIcon,
    UserGroupIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Training', href: '/dashboard/training', icon: PuzzlePieceIcon },
    { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
    { name: 'Social', href: '/dashboard/social', icon: UserGroupIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
            <div className='relative h-24 grow-0 flex items-center justify-center'>
                <Image
                    src="/paw-print.png"
                    alt="Dog Strava Logo"
                    width={96}
                    height={96}
                />
            </div>
            <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-secondary hover:text-gray-900'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'h-6 w-6 shrink-0',
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
