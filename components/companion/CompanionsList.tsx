import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn, getSubjectColor } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface CompanionsListProps {
    title: string;
    companions?: Companion[]; 
    classNames?: string;
}

const CompanionsList = ({title, companions, classNames}: CompanionsListProps) => {
    return (
        <article className={cn('companion-list', classNames)} >
            <h2 className='font-bold text-3xl'>{title}</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3">Lessons</TableHead>
                        <TableHead className='text-lg'>Subject</TableHead>
                        <TableHead className='text-lg text-right'>Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        companions?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/companions/${item.id}`} className="hover:underline">
                                        <div className='flex items-center gap-2'>
                                            <div className=' size-[72px] rounded-lg flex items-center justify-center max-md:hidden' style={{backgroundColor: getSubjectColor(item.subject)}}>
                                                <Image
                                                    src={`/icons/${item.subject.toLowerCase()}.svg`}
                                                    alt={item.subject}
                                                    width={35}
                                                    height={35}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <p className='font-bold text-2xl'>{item.name}</p>
                                                <p className='text-lg'>{item.topic}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className='subject-badge max-md:hidden w-fit'>
                                        {item.subject}
                                    </div>
                                    <div className='flex items-center justify-center rounded-lg w-fit p-2 md:hidden'
                                            style={{backgroundColor: getSubjectColor(item.subject)}}
                                    >
                                        <Image
                                            src={`/icons/${item.subject.toLowerCase()}.svg`}
                                            alt={item.subject}
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-4 w-full items-center justify-end'>
                                        <p className='text-2xl'>
                                            {item.duration} <span className='max-md:hidden'> mins </span>
                                        </p>
                                        <Image
                                            src={'/icons/clock.svg'}
                                            alt='clock'
                                            width={14}
                                            height={14}
                                            className='md:hidden'
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </article>
    )
}

export default CompanionsList
